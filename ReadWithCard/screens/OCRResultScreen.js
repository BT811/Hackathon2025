import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ActivityIndicator,
    ScrollView 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import OCRResultCard from '../components/card/OCRResultCard';
import { DeckService } from '../services/deckService';
import { CardService } from '../services/cardService';
import CreateDeckModal from '../components/deck/CreateDeckModal'; 

const OCRResultScreen = ({ route, navigation }) => {
    const { ocrResults } = route.params;
    const [selectedCards, setSelectedCards] = useState([]);
    const [userDecks, setUserDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateDeckModal, setShowCreateDeckModal] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [newDeckDesc, setNewDeckDesc] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    
    
    useFocusEffect(
        React.useCallback(() => {
            loadUserDecks();
        }, [])
    );

    const loadUserDecks = async () => {
        try {
            const decks = await DeckService.getDecks();
            setUserDecks(decks);
        } catch (error) {
            console.error('Error loading decks:', error);
            Alert.alert('Error', 'Failed to load decks');
        }
    };

    const toggleCardSelection = (result, index) => {
        const resultWithIndex = { ...result, index };
        
        setSelectedCards(prev => {
            const isSelected = prev.some(card => card.index === index);
            if (isSelected) {
                return prev.filter(card => card.index !== index);
            } else {
                return [...prev, resultWithIndex];
            }
        });
    };

    const handleSaveCards = async () => {
        if (selectedCards.length === 0) {
            Alert.alert('Error', 'Please select at least one card');
            return;
        }

        if (!selectedDeck) {
            Alert.alert('Error', 'Please select a deck');
            return;
        }

        setIsLoading(true);
        try {
            // Save cards one by one
            for (const card of selectedCards) {
                await CardService.saveCard({
                    deck_id: selectedDeck.deck_id,
                    word: card.word,
                    t_word: card.t_word,
                    description: card.description,
                    sentence: `${card.sentence}  -  ${card.t_sentence}`,
                    synonyms: card.synonyms,
                    pronunciation: card.pronunciation,
                    part_of_speech: card.part_of_speech,
                    
                }, selectedDeck.deck_id);
            }
    
            Alert.alert(
                '✅ Success', 
                '🎉The selected card has been successfully added to the deck.',
                
                [{ text: 'Cancel', onPress: () => setSelectedCards([]) },
                { text: 'Go to Decks', onPress: () => navigation.navigate('Deck') }]
            );
        } catch (error) {
            console.error('Error saving cards:', error);
            Alert.alert('Error', 'Failed to save cards');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateDeck = async () => {
        if (!newDeckName.trim()) {
            Alert.alert('Error', 'Please enter a deck name');
            return;
        }

        setIsLoading(true);
        try {
            const newDeck = await DeckService.createDeck({
                name: newDeckName,
                description: newDeckDesc,
                image_uri: selectedImage
            });

            setUserDecks(prevDecks => [...prevDecks, newDeck]);
            setSelectedDeck(newDeck);
            setShowCreateDeckModal(false);
            setNewDeckName('');
            setNewDeckDesc('');
            setSelectedImage(null);
            Alert.alert('Success', 'Deck created successfully');
        } catch (error) {
            console.error('Error creating deck:', error);
            Alert.alert('Error', 'Failed to create deck');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Cards to Save</Text>
                <Text style={styles.subtitle}>
                    {selectedCards.length} cards selected
                </Text>
            </View>
    
            <FlatList
                data={ocrResults}
                renderItem={({ item, index }) => (
                    <OCRResultCard
                        result={item}
                        isSelected={selectedCards.some(card => card.index === index)}
                        onToggleSelect={() => toggleCardSelection(item, index)}
                    />
                )}
                keyExtractor={(item, index) => `${item.word}_${index}`}
                contentContainerStyle={styles.listContent}
            />
                
            <View style={styles.footer}>
                <View style={styles.deckSelector}>
                    <View style={styles.deckHeader}>
                        <Text style={styles.deckLabel}>Select Deck</Text>
                        <TouchableOpacity
                            onPress={() => setShowCreateDeckModal(true)}
                            style={styles.addDeckButton}
                        >
                            <Ionicons name="add-circle-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
    
                    {userDecks.length === 0 ? (
                        <View style={styles.emptyDeckContainer}>
                            <Text style={styles.emptyDeckText}>
                                No decks available. Create your first deck!
                            </Text>
                        </View>
                    ) : (
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={styles.deckList}
                        >
                            {userDecks.map(deck => (
                                <TouchableOpacity
                                    key={deck.deck_id}
                                    style={[
                                        styles.deckItem,
                                        selectedDeck?.deck_id === deck.deck_id && styles.selectedDeck
                                    ]}
                                    onPress={() => setSelectedDeck(deck)}
                                >
                                    <Text style={[
                                        styles.deckName,
                                        selectedDeck?.deck_id === deck.deck_id && styles.selectedDeckText
                                    ]}>
                                        {deck.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
    
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        (!selectedDeck || selectedCards.length === 0) && styles.disabledButton
                    ]}
                    onPress={handleSaveCards}
                    disabled={!selectedDeck || selectedCards.length === 0 || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Ionicons name="save" size={24} color="white" />
                            <Text style={styles.saveButtonText}>
                                Save Selected Cards
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
    
            <CreateDeckModal
                visible={showCreateDeckModal}
                onClose={() => setShowCreateDeckModal(false)}
                onCreate={handleCreateDeck}
                onPickImage={async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [16, 9],
                        quality: 1,
                    });
    
                    if (!result.canceled) {
                        setSelectedImage(result.assets[0].uri);
                    }
                }}
                selectedImage={selectedImage}
                newDeckName={newDeckName}
                onDeckNameChange={setNewDeckName}
                newDeckDesc={newDeckDesc}
                onDeckDescChange={setNewDeckDesc}
                isLoading={isLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#001233',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    color: '#b0c4de',
    marginTop: 6,
    fontWeight: '500',
  },
  listContent: {
    padding: 18,
    paddingBottom: 0,
  },
  footer: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 6,
    shadowColor: '#001233',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  deckSelector: {
    marginBottom: 12,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deckLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001233',
  },
  addDeckButton: {
    padding: 4,
  },
  emptyDeckContainer: {
    padding: 10,
    backgroundColor: '#eaf2fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b0c4de',
    marginBottom: 8,
  },
  emptyDeckText: {
    color: '#233876',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  deckList: {
    maxHeight: 40,
    marginVertical: 4,
  },
  deckItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#b0c4de',
    marginRight: 8,
    marginBottom: 6,
    elevation: 2,
  },
  selectedDeck: {
    backgroundColor: '#0832a5ff',
  },
  deckName: {
    color: '#001233',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedDeckText: {
    color: '#fff',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0832a5ff',
    padding: 12,
    borderRadius: 12,
    gap: 6,
    marginTop: 6,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#b0c4de',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  createDeckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#0832a5ff',
    borderRadius: 10,
    borderStyle: 'dashed',
    backgroundColor: '#eaf2fb',
  },
  createDeckButtonText: {
    color: '#0832a5ff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default OCRResultScreen;