// src/screens/ImagePreviewScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WordSelectionModal from '../components/word/WordSelectionModal';
import {ApiService } from '../services/apiService';

const ImagePreviewScreen = ({ route, navigation }) => {
    const { imageUri, base64 } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [showWordModal, setShowWordModal] = useState(false);
    


    const handleWordSubmit = async (selectedWords) => {
        setIsLoading(true);
        try {
            // Use imageUri instead of base64
            const result = await ApiService.processImageAndCreateCards(imageUri, selectedWords);
            if (result) {
                navigation.navigate('OCRResult', { 
                    ocrResults: result
                });
            }
        } catch (error) {
            console.error('Error processing image and creating cards:', error);
            if (error.isAuthError) {
                Alert.alert('Authentication Error', 'Please login to process images');
            } else {
                Alert.alert('Error', 'Failed to process image and create cards');
            }
        } finally {
            setIsLoading(false);
            setShowWordModal(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: imageUri }} 
                style={styles.preview} 
                resizeMode="contain"
            />
            
            <View style={styles.controls}>
                <TouchableOpacity 
                    style={[styles.button, styles.retakeButton]}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="camera-reverse" size={24} color="white" />
                    <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.useButton]}
                    onPress={() => setShowWordModal(true)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Ionicons name="text" size={24} color="white" />
                            <Text style={styles.buttonText}>Select Words</Text>
                        </>
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
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  retakeButton: {
    backgroundColor: '#666',
  },
  useButton: {
    backgroundColor: '#2300eaff',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default ImagePreviewScreen;