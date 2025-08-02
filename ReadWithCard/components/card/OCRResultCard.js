// src/components/OCR/OCRResultCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OCRResultCard = ({ result, isSelected, onToggleSelect }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onToggleSelect}
    >
      <View style={styles.header}>
        <Text style={styles.word}>{result.word}</Text>
        <TouchableOpacity onPress={onToggleSelect}>
          <Ionicons 
            name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={24} 
            color={isSelected ? "#6200ea" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {result.t_word && (
          <Text style={styles.description}>
             "{result.t_word}"
             </Text>
        )}
        
        {result.synonyms && (
          <Text style={styles.synonyms}>
            Synonyms: {result.synonyms}
          </Text>
        )}
        {result.description && (
          <Text style={styles.description} numberOfLines={3}>
            Description: {result.description}
          </Text>
        )}
        {result.sentence && (
          <Text style={styles.description}numberOfLines={3}>
            Sentence: {result.sentence}
             </Text>
        )}
        
        {result.translated_sentence && (
          <Text style={styles.sentence}numberOfLines={2}>
            Translation: {result.translated_sentence}
          </Text>
        )}

        
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6200ea',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    gap: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  sentence: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
  },
  synonyms: {
    fontSize: 14,
    color: '#666',
  },
});

export default OCRResultCard;