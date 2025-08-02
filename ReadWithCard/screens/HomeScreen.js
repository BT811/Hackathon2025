import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { CardService } from '../services/cardService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ReviewScreen from '../screens/ReviewScreen';
import { useFocusEffect } from '@react-navigation/native';
import StreakCalendar from '../components/statistic/StreakCalendar';
import { StreakService } from '../services/streakService';
import { Ionicons } from '@expo/vector-icons';
import CardList from '../components/card/CardList';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    learning: 0,
    reviewing: 0,
    graduated: 0
  });
  const [streakData, setStreakData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayReviewCount, setTodayReviewCount] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusCards, setStatusCards] = useState([]);

  const handleStatusPress = async (status) => {
      try {
          const cards = await CardService.getCardsByStatus(status);
          setStatusCards(cards);
          setSelectedStatus(status);
      } catch (error) {
          console.error('Error fetching status cards:', error);
          Alert.alert('Error', 'Failed to load cards');
      }
  };
  

  useFocusEffect(
      React.useCallback(() => {
          const loadData = async () => {
              try {
                  
                  const today = new Date().toISOString().split('T')[0];

                  const [cardStats, streak, streakHistory] = await Promise.all([
                      CardService.getCardStats(),
                      StreakService.getCurrentStreak(),
                      StreakService.getStreakData()
                  ]);

                  const todayStreak = streakHistory.find(d => d.streak_date === today);
                  setTodayReviewCount(todayStreak?.cards_reviewed || 0);
                  setStats(cardStats);
                  setCurrentStreak(streak || 0);
                  setStreakData(streakHistory || []);

      
              } catch (error) {
                  console.error('Error loading data:', error);
              }
          };

          loadData();
      }, [])
  );

  const handleStartReview = async () => {
      try {
          const dueCards = await CardService.getDueCards();
          if (dueCards.length > 0) {
              navigation.navigate('ReviewScreen', { cards: dueCards });
          } else {
              Alert.alert('No Cards Due', 'There are no cards due for review at this time.');
          }
      } catch (error) {
          console.error('Error starting review:', error);
      }
  };
  

  return (
    
    <View style={styles.container}>
            <View style={styles.statsContainer}>
                <TouchableOpacity 
                    style={[styles.statBox, styles.learningBox]}
                    onPress={() => handleStatusPress('LEARNING')}
                >
                    <Text style={styles.statNumber}>{stats.learning}</Text>
                    <Text style={styles.statLabel}>Learning</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.statBox, styles.reviewingBox]}
                    onPress={() => handleStatusPress('REVIEWING')}
                >
                    <Text style={styles.statNumber}>{stats.reviewing}</Text>
                    <Text style={styles.statLabel}>Reviewing</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.statBox, styles.graduatedBox]}
                    onPress={() => handleStatusPress('GRADUATED')}
                >
                    <Text style={styles.statNumber}>{stats.graduated}</Text>
                    <Text style={styles.statLabel}>Graduated</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.flexSpace} />
              <StreakCalendar 
                        streakData={streakData}
                        currentStreak={currentStreak}
                    />  
            <View style={styles.flexSpace} />


      <TouchableOpacity 
        style={styles.startButton}
        onPress={handleStartReview}
      >
        <Text style={styles.startButtonText}>Start Review</Text>
      </TouchableOpacity>

      {selectedStatus && (
       <View style={styles.modalContainer}>
                <CardList
                    cards={statusCards}
                    title={`${selectedStatus.charAt(0) + selectedStatus.slice(1).toLowerCase()} Cards`}
                    onClose={() => setSelectedStatus(null)}
                />
            </View>
            )}
    </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001233',
    padding: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 36,
    gap: 12,
  },
  statBox: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  learningBox: {
    backgroundColor: '#6874dbff',
  },
  reviewingBox: {
    backgroundColor: '#234a76ff', 
  },
  graduatedBox: {
    backgroundColor: '#00BFAE', 
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  startButton: {
    backgroundColor: '#0763c5ff',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  todayStatsContainer: {
    backgroundColor: '#f7fbff',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  todayStatBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayStatText: {
    fontSize: 16,
    color: '#233876',
    fontWeight: '600',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default HomeScreen;