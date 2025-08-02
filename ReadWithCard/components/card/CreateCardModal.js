import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

const CreateCardModal = ({ 
    visible, 
    onClose, 
    onCreate, 
    newCard, 
    onCardChange,
    showAdvancedFields,
    setShowAdvancedFields,
    onPickImage,
    selectedImage
}) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Create New Card</Text>
                <ScrollView style={styles.scrollContent}>
                <TouchableOpacity 
                        style={styles.imagePickerButton}
                        onPress={onPickImage}
                    >
                        {selectedImage ? (
                            <Image 
                                source={{ uri: selectedImage }} 
                                style={styles.selectedImage}
                            />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="image-outline" size={24} color="#666" />
                                <Text style={styles.imagePlaceholderText}>
                                    Add Image
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Word *"
                        value={newCard.word}
                        onChangeText={(text) => onCardChange('word', text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Translation *"
                        value={newCard.t_word}
                        onChangeText={(text) => onCardChange('t_word', text)}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Example Sentence *"
                        value={newCard.sentence}
                        onChangeText={(text) => onCardChange('sentence', text)}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setShowAdvancedFields(!showAdvancedFields)}
                    >
                        <Text style={styles.toggleButtonText}>
                            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
                        </Text>
                        <Ionicons 
                            name={showAdvancedFields ? 'chevron-up' : 'chevron-down'} 
                            size={24} 
                            color="#6200ea" 
                        />
                    </TouchableOpacity>

                    {showAdvancedFields && (
                        <>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Description"
                                value={newCard.description}
                                onChangeText={(text) => onCardChange('description', text)}
                                multiline
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Pronunciation"
                                value={newCard.pronunciation}
                                onChangeText={(text) => onCardChange('pronunciation', text)}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Part of Speech"
                                value={newCard.part_of_speech}
                                onChangeText={(text) => onCardChange('part_of_speech', text)}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Synonyms"
                                value={newCard.synonyms}
                                onChangeText={(text) => onCardChange('synonyms', text)}
                            />
                        </>
                    )}
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.createButton]}
                        onPress={onCreate}
                    >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

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
    createButton: {
        backgroundColor: '#0f79b6ff'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});
export default CreateCardModal;

