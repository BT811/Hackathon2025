import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    ScrollView,
    ActivityIndicator,
    Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WordSelectionModal from '../components/word/WordSelectionModal';
import { ApiService } from '../services/apiService';

const MAX_CHARS = 1000;

const TextInputScreen = ({ navigation }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showWordModal, setShowWordModal] = useState(false);

    const handleContinue = () => {
        if (!text.trim()) {
            Alert.alert('Error', 'Please enter some text');
            return;
        }
        setShowWordModal(true);
    };

    const handleWordSubmit = async (selectedWords) => {
        setIsLoading(true);
        try {
            const result = await ApiService.processTextAndCreateCards(text, selectedWords);
            
            if (result) {
                navigation.navigate('OCRResult', { 
                    ocrResults: result,
                });
            }
        } catch (error) {
            console.error('Error processing text:', error);
            if (error.isAuthError) {
                Alert.alert('Authentication Error', 'Please login to process text');
            } else {
                Alert.alert('Error', 'Failed to process text');
            }
        } finally {
            setIsLoading(false);
            setShowWordModal(false);
        }
    };

    const renderCharacterCount = () => (
        <Text style={styles.characterCount}>
            {`${text.length}/${MAX_CHARS}`}
        </Text>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Enter or paste your text here..."
                    value={text}
                    onChangeText={setText}
                    textAlignVertical="top"
                    maxLength={MAX_CHARS}
                />
                {renderCharacterCount()}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, !text.trim() && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!text.trim() || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Ionicons name="arrow-forward" size={24} color="#001233" />
                            <Text style={styles.buttonText}>Continue</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <WordSelectionModal
                visible={showWordModal}
                onClose={() => setShowWordModal(false)}
                onSubmit={handleWordSubmit}
                isLoading={isLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001233',
        justifyContent: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    textInput: {
        backgroundColor: '#b0c4de',
        borderRadius: 14,
        padding: 18,
        minHeight: 180,
        fontSize: 17,
        color: '#001233',
        textAlignVertical: 'top',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.13,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#fff',
    },
    characterCount: {
        textAlign: 'right',
        color: '#233876',
        fontSize: 13,
        marginTop: 8,
        fontWeight: '500',
    },
    footer: {
        padding: 18,
        backgroundColor: '#001233',
        borderTopWidth: 1,
        borderTopColor: '#b0c4de',
    },
    button: {
        backgroundColor: '#b0c4de',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonDisabled: {
        backgroundColor: '#8daed8',
    },
    buttonText: {
        color: '#001233',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
export default TextInputScreen;