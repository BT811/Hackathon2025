import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import CreateDeckModal from '../components/deck/CreateDeckModal';
import EditDeckModal from '../components/deck/EditDeckModal';
import { DeckService } from '../services/deckService';
import Deck from '../components/deck/Deck'

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function DeckScreen({navigation}) {
    const [decks, setDecks] = useState([]);
    const [newDeckName, setNewDeckName] = useState('');
    const [newDeckDesc, setNewDeckDesc] = useState('');
    const [editingDeck, setEditingDeck] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        loadDecks(); 

        // Add listener for when screen comes into focus
        const unsubscribe = navigation.addListener('focus', () => {
            loadDecks(); 
        });

        return unsubscribe;
    }, [navigation]);

    const loadDecks = async () => {
        try {
            const userDecks = await DeckService.getDecks();
            setDecks(userDecks);
        } catch (error) {
            console.error('Error loading decks:', error);
        }
    };

    const handleUpdateDeck = async () => {
        if (!newDeckName.trim()) {
            Alert.alert('Error', 'Deck name is required');
            return;
        }

        try {
            const updatedDeck = await DeckService.updateDeck(editingDeck.deck_id, {
                name: newDeckName.trim(),
                description: newDeckDesc || null,
                image_uri: selectedImage
            });

            setDecks(prev => prev.map(deck => 
                deck.deck_id === updatedDeck.deck_id ? updatedDeck : deck
            ));
            setIsEditModalVisible(false);
            resetForm();
        } catch (error) {
            console.error('Error updating deck:', error);
            Alert.alert('Error', 'Failed to update deck');
        }
    };

    const handleDeleteDeck = async () => {
        Alert.alert(
            '⚠️ Delete Deck',
            'Are you sure you want to delete this deck? All cards in this deck will also be deleted.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await DeckService.deleteDeck(editingDeck.deck_id);
                            setDecks(prev => prev.filter(deck => deck.deck_id !== editingDeck.deck_id));
                            setIsEditModalVisible(false);
                            resetForm();
                        } catch (error) {
                            console.error('Error deleting deck:', error);
                            Alert.alert('Error', 'Failed to delete deck');
                        }
                    }
                }
            ]
        );
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
                aspect: [16, 9],
                quality: 0.7,
            });
    
            if (!result.canceled && result.assets && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image');
        }
    };

    const handleCreateDeck = async () => {
        if (!newDeckName.trim()) {
            Alert.alert('Error', 'Deck name is required');
            return;
        }
    
        try {
            const newDeck = await DeckService.createDeck({
                name: newDeckName.trim(),
                description: newDeckDesc || null,
                image_uri: selectedImage || null 
            });
    
            setDecks(prev => [...prev, newDeck]);
            setModalVisible(false);
            setNewDeckName('');
            setNewDeckDesc('');
            setSelectedImage(null);
        } catch (error) {
            console.error('Error creating deck:', error);
            Alert.alert('Error', 'Failed to create deck');
        }
    };

    const resetForm = () => {
        setEditingDeck(null);
        setSelectedImage(null);
        setNewDeckName('');
        setNewDeckDesc('');
    };

    const handleEditDeck = (deck) => {
        setEditingDeck(deck);
        setSelectedImage(deck.image_uri);
        setNewDeckName(deck.name);
        setNewDeckDesc(deck.description || '');
        setIsEditModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setNewDeckName('');
        setNewDeckDesc('');
        setSelectedImage(null);
    };

    useEffect(() => {
        const fetchDecks = async () => {
            const fetchedDecks = await DeckService.getAllDecks();
            setDecks(fetchedDecks);
        };

        fetchDecks();
    }, []);

    return (
     <View style={styles.container}>
            <FlatList
                data={decks}
                renderItem={({ item }) => (
                    <Deck
                        item={item}
                        onPress={() => navigation.navigate('DeckCards', { deck: item })}
                        onEdit={() => handleEditDeck(item)}
                    />
                )}
                keyExtractor={item => item.deck_id.toString()}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No personal decks yet. Create one!
                    </Text>
                }
            />


            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>

      {/* Modal */}
      <CreateDeckModal 
                visible={modalVisible}
                onClose={handleCloseModal}
                onCreate={handleCreateDeck}
                onPickImage={pickImage}
                selectedImage={selectedImage}
                newDeckName={newDeckName}
                onDeckNameChange={setNewDeckName}
                newDeckDesc={newDeckDesc}
                onDeckDescChange={setNewDeckDesc}
            />
        
        <EditDeckModal 
                    visible={isEditModalVisible}
                    onClose={() => {
                        setIsEditModalVisible(false);
                        resetForm();
                    }}
                    onSave={handleUpdateDeck}
                    onDelete={handleDeleteDeck}
                    onPickImage={pickImage}
                    selectedImage={selectedImage}
                    deckName={newDeckName}
                    onDeckNameChange={setNewDeckName}
                    deckDesc={newDeckDesc}
                    onDeckDescChange={setNewDeckDesc}
                />
    </View>
  );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001233',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#b0c4de',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    opacity: 0.7,
  },
});