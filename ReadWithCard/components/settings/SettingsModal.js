import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NATIVE_LANGUAGES = ['Turkish', 'German',  'Spanish', 'Italian', 'Russian', 'Chinese'];
const LEARNING_LANGUAGES = ['English'];

export default function SettingsModal({ visible, onClose }) {
  const [settings, setSettings] = useState({ n_language: 'Turkish', l_language: 'English' });

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await AsyncStorage.getItem('userLanguageSettings');
      if (saved) setSettings(JSON.parse(saved));
    };
    if (visible) loadSettings();
  }, [visible]);

  const handleSave = async () => {
    await AsyncStorage.setItem('userLanguageSettings', JSON.stringify(settings));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Language Settings</Text>
          <Text style={styles.label}>Native Language</Text>
          <Picker
            selectedValue={settings.n_language}
            onValueChange={value => setSettings(s => ({ ...s, n_language: value }))}
            style={styles.picker}
          >
            {NATIVE_LANGUAGES.map(lang => (
              <Picker.Item key={lang} label={lang} value={lang} />
            ))}
          </Picker>
          <Text style={styles.label}>Learning Language</Text>
          <Picker
            selectedValue={settings.l_language}
            onValueChange={value => setSettings(s => ({ ...s, l_language: value }))}
            style={styles.picker}
          >
            {LEARNING_LANGUAGES.map(lang => (
              <Picker.Item key={lang} label={lang} value={lang} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#f7fbff',
    borderRadius: 18,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    elevation: 6,
    shadowColor: '#001233',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#001233',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
    color: '#0832a5ff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  picker: {
    width: '100%',
    backgroundColor: '#eaf2fb',
    borderRadius: 10,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#0832a5ff',
    padding: 14,
    borderRadius: 10,
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  cancelButton: {
    backgroundColor: '#b0c4de',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 1,
  },
  cancelButtonText: {
    color: '#001233',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});