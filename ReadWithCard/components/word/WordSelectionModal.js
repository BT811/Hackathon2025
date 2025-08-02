import React, { useState } from 'react';
import { 
    View, 
    Text, 
    Modal, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView,
    Alert ,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WordSelectionModal = ({ visible, onClose, onSubmit, isLoading }) => {
    const [words, setWords] = useState(['']); 
    
    const addWord = () => {
        if (words.length >= 10) {
            Alert.alert('Limit Reached', 'You can only add up to 10 words');
            return;
        }
        setWords([...words, '']);
    };

    const removeWord = (index) => {
        const newWords = words.filter((_, i) => i !== index);
        setWords(newWords);
    };

    const updateWord = (text, index) => {
        const newWords = [...words];
        newWords[index] = text;
        setWords(newWords);
    };

    const handleSubmit = () => {
        const filteredWords = words.filter(word => word.trim().length > 0);
        if (filteredWords.length === 0) {
            Alert.alert('Error', 'Please enter at least one word');
            return;
        }
        onSubmit(filteredWords);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Words to Learn</Text>
                    <Text style={styles.subtitle}>Add up to 10 words or phrases</Text>
                    
                    <ScrollView style={styles.wordList}>
                        {words.map((word, index) => (
                            <View key={index} style={styles.wordInputContainer}>
                                <TextInput
                                    style={styles.wordInput}
                                    value={word}
                                    onChangeText={(text) => updateWord(text, index)}
                                    placeholder={`Word/Phrase ${index + 1}`}
                                />
                                {words.length > 1 && (
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removeWord(index)}
                                    >
                                        <Ionicons name="close-circle" size={24} color="#dc3545" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={addWord}
                        disabled={words.length >= 10}
                    >
                        <Ionicons name="add" size={24} color="#6200ea" />
                        <Text style={styles.addButtonText}>Add Word</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.submitButton]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Submit</Text>
                            )}
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
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#f7fbff',
        borderRadius: 18,
        padding: 24,
        maxHeight: '85%',
        elevation: 6,
        shadowColor: '#001233',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#001233',
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 15,
        color: '#233876',
        textAlign: 'center',
        marginBottom: 18,
    },
    wordList: {
        maxHeight: 320,
    },
    wordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    wordInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#b0c4de',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#001233',
        elevation: 1,
    },
    removeButton: {
        marginLeft: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginVertical: 12,
        backgroundColor: '#eaf2fb',
        borderRadius: 10,
        elevation: 2,
    },
    addButtonText: {
        color: '#0832a5ff',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 18,
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 4,
        elevation: 2,
    },
    cancelButton: {
        backgroundColor: '#b0c4de',
    },
    submitButton: {
        backgroundColor: '#0832a5ff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
});

export default WordSelectionModal;