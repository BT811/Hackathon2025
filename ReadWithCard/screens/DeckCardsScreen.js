import React, { useState, useEffect } from 'react';
import { 
    View, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Text, 
    Modal,
    TextInput,
    Alert ,
    ScrollView,
    Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 

import { Ionicons } from '@expo/vector-icons';
import { CardService } from '../services/cardService';
import { DeckService } from '../services/deckService';
import EditCardModal from '../components/card/EditCardModal';


import Card from '../components/card/Card';
import CreateCardModal from '../components/card/CreateCardModal'
import CardDetailsModal from '../components/card/CardDetailsModal';

const DeckCardsScreen = ({ route, navigation }) => {
    const { deck } = route.params;
    const [cards, setCards] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showAdvancedFields, setShowAdvancedFields] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [newCard, setNewCard] = useState({
        word: '',
        t_word: '',
        description: '',
        pronunciation: '',
        part_of_speech: '',
        synonyms: '',
        sentence: ''
    });

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            const deckCards = await CardService.getCards(deck.deck_id);
            setCards(deckCards);
        } catch (error) {
            console.error('Error loading cards:', error);
            Alert.alert('Error', 'Failed to load cards');
        }
    };

    const handleCreateCard = async () => {
        if (!newCard.word.trim()) {
            Alert.alert('Error', 'Word is required');
            return;
        }
    
        try {
            await CardService.saveCard({
                ...newCard,
                deck_id: deck.deck_id
            });
    
            handleCloseModal(); 
            loadCards();
        } catch (error) {
            console.error('Error creating card:', error);
            Alert.alert('Error', 'Failed to create card');
        }
    };

   

    const handleCardUpdate = (updateInfo) => {
        if (updateInfo?.isDeleted) {
            setCards(prevCards => prevCards.filter(card => card.card_id !== editingCard.card_id));
        } else {
            // Card was updated
            setCards(prevCards => 
                prevCards.map(card => 
                    card.card_id === updateInfo.card_id ? updateInfo : card
                )
            );
        }
    };

    const handleShowDetails = (card) => {
        setSelectedCard(card);
        setIsDetailsModalVisible(true);
    };

    const handleCardChange = (field, value) => {
        setNewCard(prev => ({ ...prev, [field]: value }));
    };
    const pickImage = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (permission.status !== 'granted') {
                Alert.alert('Permission needed', 'Please allow access to your photos');
                return;
            }
    
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
    
            if (!result.canceled && result.assets && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                setNewCard(prev => ({ ...prev, image_uri: result.assets[0].uri }));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image');
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
        setShowAdvancedFields(false);
        setNewCard({
            word: '',
            t_word: '',
            description: '',
            pronunciation: '',
            part_of_speech: '',
            synonyms: '',
            sentence: '',
            image_uri: null
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cards}
                renderItem={({ item }) => (
                    <Card 
                        item={item} 
                        onShowDetails={handleShowDetails}
                        onEdit={() => {
                            setEditingCard(item);
                            setSelectedImage(item.image_uri);
                            setShowAdvancedFields(false);
                            setIsEditModalVisible(true);
                        }}
                    />
                )}
                keyExtractor={item => item.card_id.toString()}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No cards in this deck yet.</Text>
                }
            />
        

            <EditCardModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                card={editingCard}
                onUpdate={handleCardUpdate}

            />

            <CreateCardModal 
                visible={isModalVisible}
                onClose={handleCloseModal}
                onCreate={handleCreateCard}
                newCard={newCard}
                onCardChange={handleCardChange}
                showAdvancedFields={showAdvancedFields}
                setShowAdvancedFields={setShowAdvancedFields}
                onPickImage={pickImage}
                selectedImage={selectedImage}
            />

            <CardDetailsModal 
                visible={isDetailsModalVisible}
                onClose={() => setIsDetailsModalVisible(false)}
                card={selectedCard}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setIsModalVisible(true)}
            >
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001233', 
        paddingHorizontal: 8,
        paddingTop: 8
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#b0c4de', 
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: '#fff'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 60,
        color: '#b0c4de', 
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.2
    }
});


export default DeckCardsScreen;