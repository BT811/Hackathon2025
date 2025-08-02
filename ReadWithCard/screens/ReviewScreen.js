import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { CardService } from '../services/cardService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { DeckService } from '../services/deckService';
import { StreakService } from '../services/streakService';
import ReviewCard from '../components/card/ReviewCard';
import { StyleSheet } from 'react-native';
const ReviewScreen = ({ route, navigation }) => {
    const { cards: initialRouteCards } = route.params;

    const [allCards, setAllCards] = useState(initialRouteCards);
    const [cards, setCards] = useState(initialRouteCards);        
    const [currentIndex, setCurrentIndex] = useState(0);
    const [decks, setDecks] = useState([]);
    const [reviewedCardsCount, setReviewedCardsCount] = useState(0);
    const [selectedDeckId, setSelectedDeckId] = useState('all');
    const [showDeckFilter, setShowDeckFilter] = useState(false);

    useEffect(() => {
        loadTodayReviewCount();
    }, []);

    useEffect(() => {
        loadDecksWithCardCount(allCards);
    }, [allCards]);

    const loadDecksWithCardCount = async (cardList) => {
        try {
            const allDecks = await DeckService.getDecks();

            const deckStats = allDecks.map(deck => ({
                ...deck,
                totalCards: cardList.filter(card => card.deck_id === deck.deck_id).length,
            }))
            .filter(deck => deck.totalCards > 0);

            const filteredDecks = [
                {
                    deck_id: 'all',
                    name: 'All Cards',
                    totalCards: cardList.length,
                },
                ...deckStats,
            ];

            setDecks(filteredDecks);
        } catch (error) {
            console.error('Error loading decks:', error);
        }
    };

    const handleDeckSelect = (deckId) => {
        setSelectedDeckId(deckId);
        if (deckId === 'all') {
            setCards(allCards);
        } else {
            const filteredCards = allCards.filter(card => card.deck_id === deckId);
            setCards(filteredCards);
        }
        setCurrentIndex(0);
    };

    const loadTodayReviewCount = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const dailyStats = await StreakService.getDailyStreak(today);

            if (dailyStats) {
                setReviewedCardsCount(dailyStats.cards_reviewed || 0);
            }
        } catch (error) {
            console.error('Error loading today review count:', error);
        }
    };

    const handleSwipe = async (direction, card) => {
        try {
            if (!card) {
                if (currentIndex === cards.length - 1) {
                    handleReviewComplete();
                } else {
                    setCurrentIndex(prev => prev + 1);
                }
                return;
            }

            const isLastCard = currentIndex === cards.length - 1;
            const newReviewedCount = reviewedCardsCount + 1;
            setReviewedCardsCount(newReviewedCount);

            // Swipe edilen kartı listelerden çıkar
            const updatedCards = cards.filter((_, index) => index !== currentIndex);
            const updatedAllCards = allCards.filter(c => c.card_id !== card.card_id);

            setCards(updatedCards);
            setAllCards(updatedAllCards);
            setCurrentIndex(prev => (prev >= updatedCards.length ? 0 : prev));

            const reviewPromise = CardService.handleCardReview(
                card.card_id,
                direction === 'right'
            );
            const streakPromise = StreakService.recordDailyStreak(newReviewedCount);

            if (isLastCard) {
                await Promise.all([reviewPromise, streakPromise]);
                handleReviewComplete();
            } else {
                Promise.all([reviewPromise, streakPromise]).catch(err =>
                    console.error('Background error:', err)
                );
            }

        } catch (error) {
            console.error('Error handling swipe:', error);
        }
    };

    const handleReviewComplete = () => {
        Alert.alert(
            '🎉Review Complete🎉',
            `You reviewed ${reviewedCardsCount + 1} cards today! 💪`,
            [{
                text: 'OK',
                onPress: () => {
                    navigation.navigate('HomeScreen', { refresh: true });
                }
            }]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.cardCount}>
                        Cards to Review: {cards.length - currentIndex}
                    </Text>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowDeckFilter(!showDeckFilter)}
                    >
                        <Ionicons name={showDeckFilter ? "chevron-up" : "chevron-down"} size={24} color="#6200ea" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.cardWrapper}>
                    {cards.length > currentIndex ? (
                        <ReviewCard
                            onSwipe={handleSwipe}
                            navigation={navigation}
                            card={cards[currentIndex]}
                        />
                    ) : (
                        <Text style={styles.noCardsText}>No more cards to review</Text>
                    )}
                </View>
            </View>

            {showDeckFilter && (
                <View style={styles.filterOverlay}>
                    <ScrollView bounces={false} style={styles.filterScroll}>
                        {decks.map(deck => (
                            <TouchableOpacity
                                key={deck.deck_id}
                                style={[
                                    styles.filterItem,
                                    selectedDeckId === deck.deck_id && styles.selectedFilterItem
                                ]}
                                onPress={() => {
                                    handleDeckSelect(deck.deck_id);
                                    setShowDeckFilter(false);
                                }}
                            >
                                <View style={styles.filterItemContent}>
                                    <Text style={styles.filterItemName}>{deck.name}</Text>
                                    <View style={styles.cardCountBadge}>
                                        <Text style={styles.cardCountText}>{deck.totalCards}</Text>
                                    </View>
                                    {selectedDeckId === deck.deck_id && (
                                        <Ionicons name="checkmark" size={20} color="#6200ea" style={styles.checkIcon} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e6ee', 
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6ee',
    elevation: 2,
    shadowColor: '#001233',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    zIndex: 1000,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e2a78',
    letterSpacing: 0.2,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e3e6ee',
  },
  content: {
    flex: 1,
    zIndex: 1,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  cardWrapper: {
    width: '100%',
    height: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 10,
  },
  noCardsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '500',
  },
  filterOverlay: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    maxHeight: 380,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#001233',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    zIndex: 1000,
    paddingVertical: 8,
  },
  filterScroll: {
    maxHeight: 300,
    borderRadius: 16,
  },
  filterItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6ee',
    backgroundColor: '#fff',
  },
  selectedFilterItem: {
    backgroundColor: '#e3e6ee',
  },
  filterItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterItemName: {
    fontSize: 16,
    color: '#1e2a78',
    fontWeight: '500',
    flex: 1,
  },
  cardCountBadge: {
    backgroundColor: '#d0e6f6',
    borderRadius: 12,
    minWidth: 28,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 8,
  },
  cardCountText: {
    fontSize: 13,
    color: '#1e2a78',
    fontWeight: '600',
  },
  checkIcon: {
    width: 24,
  },
});

export default ReviewScreen;
