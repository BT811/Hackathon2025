import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateDeckModal = ({ 
    visible, 
    onClose, 
    onCreate, 
    onPickImage,
    selectedImage,
    newDeckName,
    onDeckNameChange,
    newDeckDesc,
    onDeckDescChange 
}) => {
    return (
    <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Create New Deck</Text>
                
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
                                Add Cover Image
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Deck Name"
                    value={newDeckName}
                    onChangeText={onDeckNameChange}
                />

                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Description"
                    value={newDeckDesc}
                    onChangeText={onDeckDescChange}
                    multiline
                />

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
};
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#001f4d', // Lacivert arka plan
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
        backgroundColor: '#b0c4de', // Açık mavi
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
        color: '#235cc5ff',
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
        color: '#093b99ff'
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginLeft: 10,
        minWidth: 100,
        alignItems: 'center'
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
        fontWeight: '500'
    }
});

export default CreateDeckModal;