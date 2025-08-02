import React, { useState, useEffect } from 'react';
import { NavigationContainer  } from '@react-navigation/native';
import MainTabNavigator from './navigator/MainTabNavigator';
import { DatabaseService } from './db/database';
import { ActivityIndicator, View } from 'react-native';
export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        console.log('Initializing database...');
        await DatabaseService.initDatabase();
        console.log('Database initialized successfully');
        setDbReady(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initDB();
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001233' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}