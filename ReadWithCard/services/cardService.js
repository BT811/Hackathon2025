import {getDb} from '../db/database';

const REVIEW_INTERVALS = {
    NEW: 0,
    LEARNING_1: 4 * 60 * 60 * 1000,     
    LEARNING_2: 8 * 60 * 60 * 1000,      
    REVIEWING_1: 24 * 60 * 60 * 1000,    
    REVIEWING_2: 3 * 24 * 60 * 60 * 1000,
    GRADUATED: 7 * 24 * 60 * 60 * 1000   
};

const CARD_STATUS = {
    NEW: 'NEW',
    LEARNING: 'LEARNING',
    REVIEWING: 'REVIEWING',
    GRADUATED: 'GRADUATED'
};

export const CardService = {
    async saveCard(cardData) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            INSERT INTO cards (
                deck_id,
                word,
                t_word,
                description,
                pronunciation,
                part_of_speech,
                synonyms,
                sentence,
                status,
                image_uri,
                right_count,
                last_review,
                next_review,
                created_at
            ) VALUES (
                $deckId,
                $word,
                $tWord,
                $description,
                $pronunciation,
                $partOfSpeech,
                $synonyms,
                $sentence,
                $status,
                $image_uri,
                $rightCount,
                $lastReview,
                $nextReview,
                DATETIME('now')
            )
        `);
        
        try {
            await statement.executeAsync({
                $deckId: cardData.deck_id,
                $word: cardData.word,
                $tWord: cardData.t_word || null,
                $description: cardData.description || null,
                $pronunciation: cardData.pronunciation || null,
                $partOfSpeech: cardData.part_of_speech || null,
                $synonyms: cardData.synonyms || null,
                $sentence: cardData.sentence || null,
                $status: cardData.status || 'NEW',
                $image_uri: cardData.image_uri || null,
                $rightCount: cardData.right_count || 0,
                $lastReview: cardData.last_review || null,
                $nextReview: cardData.next_review || null
            });
            return true;
        } finally {
            await statement.finalizeAsync();
        }
    },
    
    async updateCardProgress(cardId, progressData) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            UPDATE cards 
            SET right_count = $rightCount,
                status = $status,
                last_review = $lastReview,
                next_review = $nextReview
            WHERE card_id = $cardId
        `);
        
        try {
            await statement.executeAsync({
                $cardId: cardId,
                $rightCount: progressData.rightCount,
                $status: progressData.status,
                $lastReview: progressData.lastReview,
                $nextReview: progressData.nextReview
            });
            return true;
        } finally {
            await statement.finalizeAsync();
        }
    },

    async getCard(cardId) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            SELECT * FROM cards WHERE card_id = $cardId
        `);

        try {
            const result = await statement.executeAsync({
                $cardId: cardId
            });
            return await result.getFirstAsync();
        } finally {
            await statement.finalizeAsync();
        }
    },

    async getCards(deckId) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            SELECT * FROM cards 
            WHERE deck_id = $deckId 
            ORDER BY created_at DESC
        `);
        
        try {
            const result = await statement.executeAsync({
                $deckId: deckId,
            });
            return await result.getAllAsync();
        } finally {
            await statement.finalizeAsync();
        }
    },

    async updateCard(cardId, cardData) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            UPDATE cards 
            SET word = $word,
                t_word = $tWord,
                description = $description,
                pronunciation = $pronunciation,
                part_of_speech = $partOfSpeech,
                synonyms = $synonyms,
                sentence = $sentence,
                image_uri = $imageUri
            WHERE card_id = $cardId 
        `);

        try {
            await statement.executeAsync({
                $cardId: cardId,
                $word: cardData.word,
                $tWord: cardData.t_word,
                $description: cardData.description,
                $pronunciation: cardData.pronunciation,
                $partOfSpeech: cardData.part_of_speech,
                $synonyms: cardData.synonyms,
                $sentence: cardData.sentence,
                $imageUri: cardData.image_uri
            });
            return cardData;
        } finally {
            await statement.finalizeAsync();
        }
    },

    async deleteCard(cardId) {
        const db = getDb();
        const statement = await db.prepareAsync(
            'DELETE FROM cards WHERE card_id = $cardId'
        );

        try {
            await statement.executeAsync({
                $cardId: cardId,
            });
            return true;
        } finally {
            await statement.finalizeAsync();
        }
    },

    async getCardWithReviewInfo(cardId) {
        const db = getDb();
        try {
            const statement = await db.prepareAsync(`
                SELECT 
                    c.*,
                    CASE 
                        WHEN status = 'NEW' THEN 0
                        WHEN status = 'LEARNING' THEN 1
                        WHEN status = 'REVIEWING' THEN 2
                        WHEN status = 'GRADUATED' THEN 3
                    END as progress_level
                FROM cards c
                WHERE c.card_id = $cardId 
                
            `);
    
            try {
                const result = await statement.executeAsync({
                    $cardId: cardId,
                    
                });
                
                const card = await result.getFirstAsync();
                
                if (!card) {
                    console.warn(`No card found with id ${cardId} `);
                    return null;
                }
    
                return {
                    ...card,
                    right_count: card.right_count || 0,
                    last_review: card.last_review || null,
                    next_review: card.next_review || null,
                    progress_level: card.progress_level
                };
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            console.error('Error in getCardWithReviewInfo:', error);
            throw error;
        }
    },

    
    async bulkSaveCards(cards) {
        const db = getDb();
        try {
            await db.withTransactionAsync(async () => {
                const statement = await db.prepareAsync(`
                    INSERT INTO cards (
                         deck_id,  word,t_word,
                        description, pronunciation, part_of_speech,
                        synonyms, sentence, status, image_uri, right_count,
                        last_review, next_review, created_at
                    ) VALUES (
                        $deckId, $word, $tWord,
                        $description, $pronunciation, $partOfSpeech,
                        $synonyms, $sentence, $status,$image_uri, $rightCount,
                        $lastReview, $nextReview, DATETIME('now')
                    )
                `);

                try {
                    for (const card of cards) {
                        await statement.executeAsync({
                            $deckId: card.deck_id,
                            $word: card.word,
                            $tWord: card.t_word || null,
                            $description: card.description,
                            $pronunciation: card.pronunciation,
                            $partOfSpeech: card.part_of_speech,
                            $synonyms: card.synonyms,
                            $sentence: card.sentence,
                            $status: card.status,
                            $image_uri: card.image_uri || null,
                            $rightCount: card.right_count,
                            $lastReview: card.last_review,
                            $nextReview: card.next_review
                        });
                    }
                } finally {
                    await statement.finalizeAsync();
                }
            });
            return true;
        } catch (error) {
            console.error('Error in bulkSaveCards:', error);
            throw error;
        }
    },
    async getCardsByStatus(status) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            SELECT * FROM cards 
            WHERE status = $status
        `);
        
        try {
            const result = await statement.executeAsync({
                $status: status
            });
            return await result.getAllAsync();
        } finally {
            await statement.finalizeAsync();
        }
    },

    async getCardStats() {
        const db = getDb();
        try {
            const learning = await CardService.getCardsByStatus('LEARNING');
            const reviewing = await CardService.getCardsByStatus('REVIEWING');
            const graduated = await CardService.getCardsByStatus('GRADUATED');

            return {
                learning: learning.length,
                reviewing: reviewing.length,
                graduated: graduated.length
            };
        } catch (error) {
            console.error('Error getting card stats:', error);
            throw error;
        }
    },
    async getDueCards() {
        const db = getDb();
        const now = new Date().toISOString();
        const statement = await db.prepareAsync(`
            SELECT * FROM cards 
             
            WHERE next_review IS NULL OR next_review <= $now
            ORDER BY 
                CASE status 
                    WHEN 'NEW' THEN 1
                    WHEN 'LEARNING' THEN 2
                    WHEN 'REVIEWING' THEN 3
                    WHEN 'GRADUATED' THEN 4
                END,
                next_review ASC
        `);
        
        try {
            const result = await statement.executeAsync({
                $now: now
            });
            return await result.getAllAsync();
        } finally {
            await statement.finalizeAsync();
        }
    },
    async getCardProgress(cardId) {
        const db = getDb();
        try {
            const card = await CardService.getCardWithReviewInfo(cardId);
            return {
                rightCount: card.right_count,
                status: card.status,
                lastReview: card.last_review,
                nextReview: card.next_review,
                progressLevel: card.progress_level
            };
        } catch (error) {
            console.error('Error getting card progress:', error);
            throw error;
        }
    },

     async handleCardReview(cardId,  isCorrect) {
        const db = getDb();
        try {
            const card = await CardService.getCardWithReviewInfo(cardId);
            if (!card) throw new Error('Card not found');
    
            const now = new Date().toISOString();
            let nextReview;
            let newStatus;
            let rightCount;
    
            if (isCorrect) {
                rightCount = (card?.right_count || 0) + 1;
                
                switch (rightCount) {
                    case 1:
                        nextReview = new Date(Date.now() + REVIEW_INTERVALS.LEARNING_1);
                        newStatus = CARD_STATUS.LEARNING;
                        break;
                    case 2:
                        nextReview = new Date(Date.now() + REVIEW_INTERVALS.LEARNING_2);
                        newStatus = CARD_STATUS.LEARNING;
                        break;
                    case 3:
                        nextReview = new Date(Date.now() + REVIEW_INTERVALS.REVIEWING_1);
                        newStatus = CARD_STATUS.REVIEWING;
                        break;
                    case 4:
                        nextReview = new Date(Date.now() + REVIEW_INTERVALS.REVIEWING_2);
                        newStatus = CARD_STATUS.REVIEWING;
                        break;
                    default:
                        nextReview = new Date(Date.now() + REVIEW_INTERVALS.GRADUATED);
                        newStatus = CARD_STATUS.GRADUATED;
                }
            } else {
                // If incorrect, decrement right_count but don't go below 0
                rightCount = Math.max(0, (card.right_count || 0) - 1);
                nextReview = new Date(Date.now() + REVIEW_INTERVALS.LEARNING_1); 
                newStatus = CARD_STATUS.LEARNING; 
            }
    
            // Update card progress
            await CardService.updateCardProgress(cardId, {
                rightCount,
                status: newStatus,
                lastReview: now,
                nextReview: nextReview.toISOString()
            });
            
    
            return {
                cardId,
                rightCount,
                status: newStatus,
                lastReview: now,
                nextReview: nextReview.toISOString()
            };
        } catch (error) {
            console.error('Error handling card review:', error);
            throw error;
        }
    },
}