// src/components/Deck/EditDeckModal.js
import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EditDeckModal = ({ 
    visible, 
    onClose, 
    onSave,
    onDelete,
    onPickImage,
    selectedImage,
    deckName,
    onDeckNameChange,
    deckDesc,
    onDeckDescChange 
}) => (

        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Deck</Text>
                    
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
                                    Change Cover Image
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Deck Name"
                        value={deckName}
                        onChangeText={onDeckNameChange}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description"
                        value={deckDesc}
                        onChangeText={onDeckDescChange}
                        multiline
                    />

                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton]}
                                onPress={onDelete}
                            >
                                <Ionicons name="trash-outline" size={20} color="white" />
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>

                            <View style={styles.rightButtons}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={onSave}
                                >
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#001233', 
        borderRadius: 16,
        padding: 22,
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
    imagePickerButton: {
        width: '100%',
        height: 140,
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
    input: {
        borderWidth: 1,
        borderColor: '#b0c4de',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#001233'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    buttonContainer: {
        marginTop: 20
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButton: {
        backgroundColor: '#f05959ff',
        flexDirection: 'row',
        paddingHorizontal: 12
    },
    rightButtons: {
        flexDirection: 'row'
    },
    cancelButton: {
        backgroundColor: '#7fa9e0ff',
        marginRight: 16
    },
    saveButton: {
        backgroundColor: '#0f63b6ff'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 4
    }
});

export default EditDeckModal;