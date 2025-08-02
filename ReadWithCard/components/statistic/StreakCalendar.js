import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StreakCalendar = ({ streakData, currentStreak }) => {
    const renderWeek = () => {
        const today = new Date();
        const days = [];
        
        for (let i = -5; i <= 1; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayData = streakData.find(d => d.streak_date === dateStr);
            const hasActivity = dayData?.cards_reviewed > 0;
            
            days.push(
                <View key={dateStr} style={styles.dayContainer}>
                    <Text style={[styles.dayText, i === 0 && styles.todayText]}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                    </Text>
                    <View style={[
                        styles.dayCircle,
                        hasActivity && styles.activeDay,
                        i === 0 && styles.todayCircle
                    ]}>
                        {hasActivity && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                </View>
            );
        }
        return days;
    };

    const renderReviewCounts = () => {
        const today = new Date();
        const counts = [];
        
        for (let i = -5; i <= 1; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayData = streakData.find(d => d.streak_date === dateStr);
            const hasActivity = dayData?.cards_reviewed > 0;
            
            counts.push(
                <View key={dateStr} style={styles.reviewCountContainer}>
                    <Text style={[
                        styles.reviewCount,
                        hasActivity && styles.activeReviewCount
                    ]}>
                        {dayData?.cards_reviewed || 0}
                    </Text>
                </View>
            );
        }
        return counts;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <View style={styles.streakInfo}>
                    <Ionicons name="flame" size={24} color="#0c55f1ff" />
                    <Text style={styles.streakText}>{currentStreak} Day Streak!</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.calendarContainer}>
                {renderWeek()}
            </View>
            <Text style={styles.reviewTitle}>Daily Reviews</Text>
            <View style={styles.reviewCountsContainer}>
                {renderReviewCounts()}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 18,
    elevation: 4,
    backgroundColor: '#d8e5fdff',
    shadowColor: '#001233',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  headerSection: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  streakText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e2a78',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: '#d7dfebff',
    marginVertical: 14,
    borderRadius: 2,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 2,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 6,
    width: '14%',
  },
  dayText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  todayText: {
    color: '#1e2a78',
    fontWeight: 'bold',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f6f8fc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e3e6ee',
    transition: 'border-color 0.2s',
  },
  activeDay: {
    backgroundColor: '#4db8ffff',
    borderColor: '#049bc9ff',
  },
  todayCircle: {
    borderColor: '#1e2a78',
    borderWidth: 3,
  },
  reviewTitle: {
    fontSize: 15,
    color: '#1e2a78',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  reviewCountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    gap: 2,
  },
  reviewCountContainer: {
    height: 22,
    minWidth: 26,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cedeffff',
    paddingHorizontal: 8,
    elevation: 1,
    shadowColor: '#001233',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  reviewCount: {
    fontSize: 13,
    color: '#666',
    fontWeight: 'bold',
  },
  activeReviewCount: {
    color: '#29305eff',
    fontWeight: 'bold',
  },
});

export default StreakCalendar;