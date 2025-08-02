import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


const API_BASE_URL = 'http://localhost:8000';
const API_TIMEOUT = 30000;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; 
const MAX_TEXT_LENGTH = 1000;

const DEFAULT_LANGUAGE_SETTINGS = {
    n_language: "Turkish",
    l_language: "English"
};

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const endpoints = {
    createCards: {
        createCardsWithImage: () => '/api/cards/image',
        createCardsWithText: () => '/api/cards/text',
    },
    chat: {
        checkSentence: () => '/api/chat/check-sentence',
        continue: () => '/api/chat/continue',
    },
};

export const ApiService = {

    //chat
    async checkSentence(word, sentence) {
        try {
            const languageSettings = await ApiService.getUserLanguageSettings()
            const response = await api.post(endpoints.chat.checkSentence(), {
                word,
                sentence,
                n_language: languageSettings.n_language,
                l_language: languageSettings.l_language
            });
            
            return response.data;
        } catch (error) {
            if (error.response?.status === 403) {
                Alert.alert(
                    'Error',
                    'Error'
                );
            }
            throw error;
        }
    },

    async continueChat(sessionId, message) {
        try {
            
            const response = await api.post(endpoints.chat.continue(), {
                session_id: sessionId,
                message: message
            });

            
            return response.data;
        } catch (error) {
            console.error("Error continuing chat:", error);
            throw error;
        }
    },

    //image processing
    async processImageAndCreateCards(imageData, words) {
        try {
            if (!imageData) {
                throw new Error('Image data is required');
            }
            
            const responseImage = await fetch(imageData);
            const blob = await responseImage.blob();
            const fileSize = blob.size;
    
            if (fileSize > MAX_IMAGE_SIZE) {
                throw new Error(`Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
            }
            
            const formData = new FormData();
            const imageFile = {
                uri: imageData,
                type: 'image/jpeg',
                name: 'image.jpg'
            };
            
            formData.append('image', imageFile);
            
            if (!Array.isArray(words) || words.length === 0) {
                throw new Error('Words array is required');
            }

            const languageSettings = await ApiService.getUserLanguageSettings();

            // Add language settings to formData
            formData.append('n_language', languageSettings.n_language);
            formData.append('l_language', languageSettings.l_language);
            
            words.forEach(word => formData.append('words', word));
                
            const response = await api.post(endpoints.createCards.createCardsWithImage(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (!response.data) {
                throw new Error('No data received from server');
            }
    
            return response.data;
        } catch (error) {
            if (error.response?.status === 413) {
                Alert.alert(
                    'Image Too Large',
                    `Please select an image smaller than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
                );
            } else if (error.response?.status === 422) {
                Alert.alert(
                    'Invalid Input',
                    'Please check your image and selected words'
                );
            } else if(error.response?.status ===403){

                Alert.alert(
                    'Forbidden',
                    'You do not have permission to perform this action'
                );
            } else {
                Alert.alert(
                    'Error',
                    'Failed to process image. Please try again later.'
                );
            }
            console.error('Error processing image and creating cards:', error);
            throw error;
        }
    },

    async processTextAndCreateCards(text, words) {
        try {
            if (!text || !text.trim()) {
                throw new Error('Text content is required');
            }

            if (!Array.isArray(words) || words.length === 0) {
                throw new Error('Words array is required');
            }

            if (text.length > MAX_TEXT_LENGTH) {
                throw new Error(`Text length must be less than ${MAX_TEXT_LENGTH} characters`);
            }

            const languageSettings = await ApiService.getUserLanguageSettings()
            

            const response = await api.post(endpoints.createCards.createCardsWithText(), {
                text,
                words,
                n_language: languageSettings.n_language,
                l_language: languageSettings.l_language
            });
            return response.data;
        } catch (error) {
            console.error('Error processing text and creating cards:', error);

            
            
        }
    },
    async getUserLanguageSettings() {
        try {
            const settings = await AsyncStorage.getItem('userLanguageSettings');
            return settings ? JSON.parse(settings) : DEFAULT_LANGUAGE_SETTINGS;
        } catch (error) {
            return DEFAULT_LANGUAGE_SETTINGS;
        }
    },

    async setUserLanguageSettings(n_language, l_language) {
        try {
            await AsyncStorage.setItem(
                'userLanguageSettings',
                JSON.stringify({ n_language, l_language })
            );
        } catch (error) {
            console.error('Error saving user language settings:', error);
        }
    },
}