import { getDb } from '../db/database';
export const DeckService = {
    async createDeck(deckData) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            INSERT INTO decks (
                name, description, image_uri, 
                created_at
            ) VALUES (
                $name, $description, $imageUri,
                DATETIME('now')
            )
        `);
    
        try {
            await statement.executeAsync({
                $name: deckData.name,
                $description: deckData.description || null,
                $imageUri: deckData.image_uri || null,
                $categoryId: deckData.category_id || null
            });
    
            const newDeckId = await this.getLastInsertId();
            return {
                deck_id: newDeckId,
                ...deckData,
                cardCount: 0,
                image_uri: deckData.image_uri || null
            };
        } finally {
            await statement.finalizeAsync();
        }
    },

    async getDeckWithCardCount(deckId) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            SELECT 
                d.*,
                COUNT(c.card_id) as cardCount
            FROM decks d 
            LEFT JOIN cards c ON d.deck_id = c.deck_id 
            WHERE d.deck_id = $deckId
            GROUP BY d.deck_id
        `);
        
        try {
            const result = await statement.executeAsync({
                $deckId: deckId
            });
            return await result.getFirstAsync();
        } finally {
            await statement.finalizeAsync();
        }
    },

    async getDecks() {
        const db = getDb();
        const statement = await db.prepareAsync(`
            SELECT 
                d.*,
                COALESCE(COUNT(c.card_id), 0) as cardCount
            FROM decks d 
            LEFT JOIN cards c ON d.deck_id = c.deck_id 
            GROUP BY d.deck_id
            ORDER BY d.created_at DESC
        `);
        
        try {
            const result = await statement.executeAsync();
            return await result.getAllAsync();
        } finally {
            await statement.finalizeAsync();
        }
    },
    async updateDeck(deckId, deckData) {
        const db = getDb();
        const statement = await db.prepareAsync(`
            UPDATE decks 
            SET name = $name,
                description = $description,
                image_uri = $imageUri
            WHERE deck_id = $deckId
        `);
    
        try {
            await statement.executeAsync({
                $deckId: deckId,
                $name: deckData.name,
                $description: deckData.description,
                $imageUri: deckData.image_uri
            });
    
            return {
                deck_id: deckId,
                ...deckData
            };
        } finally {
            await statement.finalizeAsync();
        }
    },
    
    async deleteDeck(deckId) {
        const db = getDb();
        const deleteCardsStmt = await db.prepareAsync(
            'DELETE FROM cards WHERE deck_id = $deckId '
        );
        
        const deleteDeckStmt = await db.prepareAsync(
            'DELETE FROM decks WHERE deck_id = $deckId'
        );
    
        try {
            await db.withTransactionAsync(async () => {
                await deleteCardsStmt.executeAsync({
                    $deckId: deckId,
                });
    
                await deleteDeckStmt.executeAsync({
                    $deckId: deckId,
                });
            });
            
            return true;
        } finally {
            await deleteCardsStmt.finalizeAsync();
            await deleteDeckStmt.finalizeAsync();
        }
    },
    async getLastInsertId() {
        const db = getDb();
        const statement = await db.prepareAsync('SELECT last_insert_rowid() as id');
        try {
            const result = await statement.executeAsync();
            const row = await result.getFirstAsync();
            return row ? row.id : null;
        } finally {
            await statement.finalizeAsync();
        }
    }
}