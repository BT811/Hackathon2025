import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CreateScreen = ({ navigation }) => {
  const takePhoto = async () => {
    // Request camera permission if needed
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access camera is required!');
      return;
    }
  
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,  
        quality: 0.8,
      });
      
      if (!result.canceled) {
        navigation.navigate('ImagePreview', {
          imageUri: result.assets[0].uri
        });
      }
    } catch (error) {
      console.error('Fotoğraf çekme hatası:', error);
      Alert.alert('Hata', 'Fotoğraf çekilemedi');
    }
  };
  
  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }
  
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const { uri } = result.assets[0];
      navigation.navigate('ImagePreview', { imageUri: uri });
    }
  };
  return (
    
    <View style={styles.container}>
      <View style={styles.noticeContainer}>
      <Text style={styles.noticeText}>
        📚 ReadWithCard
      </Text>
      <Text style={styles.noticeSubText}>
      ReadWithCard lets you create smart flashcards from any photo, image, or text. Just snap, upload, or type.
      {'\n'}• Use clear, legible text for best results.
      {'\n'}• Images should be single-page.
      </Text>
    </View>

      <TouchableOpacity style={styles.option} onPress={takePhoto}>
          <Ionicons name="camera" size={32} color="#0832a5ff" />
          <Text style={styles.optionText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={pickImage}>
        <Ionicons name="image" size={32} color="#0832a5ff" />
        <Text style={styles.optionText}>Upload Image</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.option} 
        onPress={() => navigation.navigate('TextInput')}
      >
        <Ionicons name="create" size={32} color="#0832a5ff" />
        <Text style={styles.optionText}>Enter Text</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: '#001233',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  noticeContainer: {
    backgroundColor: '#8daed8ff',
    padding: 18,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#003366',
    marginBottom: 28,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    width: '100%',
    alignItems: 'flex-start'
  },
  noticeText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#001233',
    marginBottom: 8,
    letterSpacing: 0.2
  },
  noticeSubText: {
    fontSize: 15,
    color: '#233876',
    lineHeight: 22,
  },
  option: {
    backgroundColor: '#d8e5fdff',
    paddingVertical: 22,
    paddingHorizontal: 28,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center'
  },
  optionText: {
    fontSize: 19,
    color: '#001233',
    fontWeight: '700',
    letterSpacing: 0.3
  }
});

export default CreateScreen;