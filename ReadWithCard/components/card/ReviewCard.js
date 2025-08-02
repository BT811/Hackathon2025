import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import CardDetailsModal from './CardDetailsModal';
import EditCardModal from './EditCardModal';
import SentenceInput from '../sentence/SentenceInputModal';

const theme = {
  primary: '#080966ff',
  success: '#4CAF50',
  danger: '#F44336',
  text: '#212121',
  textSecondary: '#757575',
  background: '#FFFFFF',
  border: '#E0E0E0',
};

const ReviewCard = ({ card: initialCard, onSwipe, navigation }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSentenceInput, setShowSentenceInput] = useState(false);
  const [card, setCard] = useState(initialCard);

  const translateX = useSharedValue(0);
  const leftOpacity = useSharedValue(0);
  const rightOpacity = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = 0;
    setShowDetailsModal(false);
    setShowEditModal(false);
    setCard(initialCard);
    requestAnimationFrame(() => {
      opacity.value = withTiming(1, { duration: 300 });
    });
    translateX.value = 0;
    leftOpacity.value = 0;
    rightOpacity.value = 0;
    setIsFlipped(false);
  }, [initialCard]);

  const handleCardUpdate = (updateInfo) => {
    if (updateInfo?.isDeleted) {
      onSwipe('right', null);
    } else {
      setCard(updateInfo);
    }
  };

  const handleSentenceSubmit = (newSentence) => {
    const updatedCard = {
      ...card,
      sentence: newSentence,
      last_review: new Date().toISOString(),
    };
    setCard(updatedCard);
    setShowSentenceInput(false);
  };

  const handleQuickApprove = () => {
    setShowSentenceInput(true);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      leftOpacity.value = 0;
      rightOpacity.value = 0;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      if (event.translationX < 0) {
        leftOpacity.value = Math.min(Math.abs(event.translationX) / 100, 1);
        rightOpacity.value = 0;
      } else {
        rightOpacity.value = Math.min(event.translationX / 100, 1);
        leftOpacity.value = 0;
      }
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > 100) {
        opacity.value = withTiming(0, { duration: 200 }, () => {
          translateX.value = withSpring(event.translationX > 0 ? 500 : -500);
          runOnJS(onSwipe)(event.translationX > 0 ? 'right' : 'left', card);
        });
      } else {
        translateX.value = withSpring(0);
        leftOpacity.value = withSpring(0);
        rightOpacity.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
    opacity: opacity.value,
  }));

  const leftOverlayStyle = useAnimatedStyle(() => ({
    opacity: leftOpacity.value,
  }));

  const rightOverlayStyle = useAnimatedStyle(() => ({
    opacity: rightOpacity.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle, { overflow: 'visible' }]}>
        <TouchableOpacity
          onPress={() => setIsFlipped(!isFlipped)}
          activeOpacity={0.9}
          style={styles.touchable}
        >
          <Animated.View style={[styles.overlay, styles.leftOverlay, leftOverlayStyle]}>
            <Text style={styles.overlayText}>Need Practice</Text>
          </Animated.View>
          <Animated.View style={[styles.overlay, styles.rightOverlay, rightOverlayStyle]}>
            <Text style={styles.overlayText}>Known Well</Text>
          </Animated.View>

          <View style={styles.cardContent}>
            <View style={styles.fixedContent}>
              {card?.image_uri ? (
                <Image
                  source={{ uri: card.image_uri }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={styles.emptyImageSpace} />
              )}
              <Text
                style={[
                  styles.word,
                  !card?.image_uri && styles.wordNoImage,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {card.word}
              </Text>
            </View>
            {isFlipped && (
              <View style={styles.detailsContainer}>
                {card?.t_word && (
                  <Text style={styles.translation} numberOfLines={1} ellipsizeMode="tail">
                    /{card.t_word}/
                  </Text>
                )}
                {card?.sentence && (
                  <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                    {card.sentence}
                  </Text>
                )}
                {card?.pronunciation && (
                  <Text style={styles.pronunciation} numberOfLines={1} ellipsizeMode="tail">
                    /{card.pronunciation}/
                  </Text>
                )}
                {card?.part_of_speech && (
                  <Text style={styles.partOfSpeech} numberOfLines={1} ellipsizeMode="tail">
                    {card.part_of_speech}
                  </Text>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="pencil" size={20} color="#6200ea" />
            <Text style={styles.footerButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setShowDetailsModal(true)}
          >
            <Ionicons name="information-circle" size={20} color="#6200ea" />
            <Text style={styles.footerButtonText}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exerciseButton}
            onPress={handleQuickApprove}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.exerciseButtonText}>Exercise</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <CardDetailsModal
            visible={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            card={card}
          />
        </View>

        <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <EditCardModal
            visible={showEditModal}
            onClose={() => setShowEditModal(false)}
            card={card}
            onUpdate={handleCardUpdate}
          />
        </View>
        <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <SentenceInput
            visible={showSentenceInput}
            word={card?.word || ''}
            onClose={() => setShowSentenceInput(false)}
            onSubmit={handleSentenceSubmit}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    aspectRatio: 0.65,
    backgroundColor: theme.background,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'absolute',
    borderWidth: 1,
    borderColor: theme.border,
  },
  touchable: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 24,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 70,
  },
  fixedContent: {
    width: '100%',
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#e3e6ee',
  },
  emptyImageSpace: {
    height: 80,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
  },
  wordNoImage: {
    fontSize: 48,
    transform: [{ translateY: -20 }],
  },
  detailsContainer: {
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: theme.border,
    marginTop: 20,
    paddingTop: 20,
  },
  translation: {
    fontSize: 22,
    color: theme.primary,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  pronunciation: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  partOfSpeech: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderRadius: 24,
  },
  leftOverlay: {
    backgroundColor: `rgba(244, 67, 54, 0.8)`,
  },
  rightOverlay: {
    backgroundColor: `rgba(76, 175, 80, 0.8)`,
  },
  overlayText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    transform: [{ rotate: '-25deg' }],
    borderWidth: 3,
    borderColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    zIndex: 1,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  footerButtonText: {
    marginLeft: 6,
    color: '#555',
    fontSize: 15,
    fontWeight: '500',
  },
  exerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: theme.success,
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  exerciseButtonText: {
    marginLeft: 6,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ReviewCard;