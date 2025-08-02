import React, { useState , useEffect} from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CardService } from '../../services/cardService';

const EditCardModal = ({ visible, onClose, card: initialCard,onUpdate }) => {
    const [card, setCard] = useState(initialCard);
    const [selectedImage, setSelectedImage] = useState(initialCard?.image_uri);
    const [showAdvancedFields, setShowAdvancedFields] = useState(false);

    // Reset state when modal opens with new card
    useEffect(() => {
        setCard(initialCard);
        setSelectedImage(initialCard?.image_uri);
    }, [initialCard]);

    const handleCardChange = (field, value) => {
        setCard(prev => ({ ...prev, [field]: value }));
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
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image');
        }
    };

    const handleSave = async () => {
        if (!card.word?.trim()) {
            Alert.alert('Error', 'Word is required');
            return;
        }
    
        try {
            const updatedCard = await CardService.updateCard(card.card_id, {
                ...card,
                image_uri: selectedImage
            });

            if (onUpdate) {
                onUpdate(updatedCard);
            }
            Alert.alert('Success', 'Card updated successfully');
            onClose();
        } catch (error) {
            console.error('Error updating card:', error);
            Alert.alert('Error', 'Failed to update card');
        }
    };

    const handleDelete = () => {
        Alert.alert(
            '⚠️ Delete Card',
            'Are you sure you want to delete this card? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await CardService.deleteCard(card.card_id);
                            if (onUpdate) {
                                onUpdate({ isDeleted: true }); 
                            }
                            Alert.alert('Success', 'Card deleted successfully');
                            onClose();
                        } catch (error) {
                            console.error('Error deleting card:', error);
                            Alert.alert('Error', 'Failed to delete card');
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Card</Text>
                    
                    <ScrollView style={styles.scrollContent}>
                        <TouchableOpacity 
                            style={styles.imagePickerButton}
                            onPress={pickImage}
                        >
                            {selectedImage ? (
                                <Image 
                                    source={{ uri: selectedImage }} 
                                    style={styles.selectedImage}
                                />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Ionicons name="image-outline" size={32} color="#666" />
                                    <Text style={styles.imagePlaceholderText}>
                                        Tap to add image
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
    
                        <TextInput
                            style={styles.input}
                            placeholder="Word*"
                            value={card?.word}
                            onChangeText={(text) => handleCardChange('word', text)}
                        />
    
                        <TextInput
                            style={styles.input}
                            placeholder="Translation"
                            value={card?.t_word}
                            onChangeText={(text) => handleCardChange('t_word', text)}
                        />
                        <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Example Sentence"
                                    value={card?.sentence}
                                    onChangeText={(text) => handleCardChange('sentence', text)}
                                    multiline={true}
                                    numberOfLines={4}
                                />
    
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => setShowAdvancedFields(!showAdvancedFields)}
                        >
                            <Text style={styles.toggleButtonText}>
                                {showAdvancedFields ? 'Hide' : 'Show'} Advanced Fields
                            </Text>
                            <Ionicons 
                                name={showAdvancedFields ? 'chevron-up' : 'chevron-down'} 
                                size={20} 
                                color="#6200ea" 
                            />
                        </TouchableOpacity>
    
                        {showAdvancedFields && (
                            <>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Description"
                                    value={card?.description}
                                    onChangeText={(text) => handleCardChange('description', text)}
                                    multiline={true}
                                    numberOfLines={4}
                                />
    
                                <TextInput
                                    style={styles.input}
                                    placeholder="Pronunciation"
                                    value={card?.pronunciation}
                                    onChangeText={(text) => handleCardChange('pronunciation', text)}
                                />
    
                                <TextInput
                                    style={styles.input}
                                    placeholder="Part of Speech (noun, verb, etc.)"
                                    value={card?.part_of_speech}
                                    onChangeText={(text) => handleCardChange('part_of_speech', text)}
                                />
    
                                
    
                                <TextInput
                                    style={styles.input}
                                    placeholder="Synonyms (comma separated)"
                                    value={card?.synonyms}
                                    onChangeText={(text) => handleCardChange('synonyms', text)}
                                />
                            </>
                        )}
                    </ScrollView>
    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={handleDelete}
                        >
                            <Ionicons 
                                name="trash-outline" 
                                size={20} 
                                color="white" 
                                style={styles.buttonIcon} 
                            />
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#001233', 
        borderRadius: 16,
        padding: 22,
        maxHeight: '90%',
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 18,
        textAlign: 'center'
    },
    scrollContent: {
        flexGrow: 0,
        maxHeight: '80%'
    },
    input: {
        borderWidth: 1,
        borderColor: '#b0c4de',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#001233'
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top'
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#b0c4de'
    },
    toggleButtonText: {
        color: '#001233',
        marginRight: 8,
        fontSize: 16,
        fontWeight: 'bold'
    },
    imagePickerButton: {
        width: '100%',
        height: 160,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#b0c4de', 
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderStyle: 'dashed',
        overflow: 'hidden'
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    imagePlaceholder: {
        alignItems: 'center'
    },
    imagePlaceholderText: {
        marginTop: 8,
        color: '#001233',
        fontSize: 14
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        paddingHorizontal: 8,
        backgroundColor: '#001233',
        borderTopWidth: 1,
        borderTopColor: '#b0c4de',
        gap: 8
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonIcon: {
        marginRight: 6
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        flexDirection: 'row'
    },
    cancelButton: {
        backgroundColor: '#b0c4de'
    },
    saveButton: {
        backgroundColor: '#0f79b6ff'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});

export default EditCardModal;