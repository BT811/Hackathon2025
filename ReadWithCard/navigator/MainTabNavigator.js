import React, { useState } from 'react';
import SettingsModal from '../components/settings/SettingsModal';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {  TouchableOpacity } from 'react-native';

import DeckCardsScreen from '../screens/DeckCardsScreen';

import HomeScreen from '../screens/HomeScreen';
import ReviewScreen from '../screens/ReviewScreen';
import CreateCardScreen from '../screens/CreateCardScreen';
import CameraScreen from '../screens/CameraScreen';
import ImagePreviewScreen from '../screens/ImagePreviewScreen';
import OCRResultScreen from '../screens/OCRResultScreen';
import TextInputScreen from '../screens/TextInputScreen';
import DeckScreen from '../screens/DeckScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const DeckStack = createStackNavigator();
const CreateStack = createStackNavigator();
const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <>
      <HomeStack.Navigator>
        <HomeStack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{
            title: 'ReadWithCard',
            headerStyle: { backgroundColor: '#001f4d' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: '600',
            },
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 16, padding: 8 }}
                onPress={() => setShowSettings(true)}
              >
                <Ionicons name="settings-outline" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
        <HomeStack.Screen
          name="ReviewScreen"
          component={ReviewScreen}
          options={{ 
            title: 'Review Cards',
            headerStyle: { backgroundColor: '#001f4d' }, 
            headerTintColor: '#fff' 
          }}
        />
      </HomeStack.Navigator>
      
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

const CreateStackNavigator = () => {
  return (
    <CreateStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <CreateStack.Screen 
        name="CreateCardScreen" 
        component={CreateCardScreen} 
        
      />
      <CreateStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title:'Take Photo',
          headerStyle: { backgroundColor: '#001f4d' },
          headerTintColor: '#fff',
        }}
      />
      <CreateStack.Screen 
        name="ImagePreview" 
        component={ImagePreviewScreen}
        options={{
          title: 'Preview',
          headerStyle: {
            backgroundColor: '#001f4d',
          },
          headerTintColor: '#fff',
        }}
      />
      <CreateStack.Screen 
        name="OCRResult" 
        component={OCRResultScreen}
  
      />
      <CreateStack.Screen 
        name="TextInput" 
        component={TextInputScreen}
        options={{
          title: 'Enter Text',
          headerStyle: { backgroundColor: '#8daed8' },
          headerTitleStyle: { color: '#001233', fontWeight: 'bold', fontSize: 20 },
          headerTintColor: '#001233',
        }}
      />
    </CreateStack.Navigator>
  );
};

const DeckStackNavigator = () => {
  return (
    <DeckStack.Navigator>
      <DeckStack.Screen 
        name="DeckScreen" 
        component={DeckScreen} 
        options={{ headerShown: false }} 
      />
      <DeckStack.Screen
        name="DeckCards"
        component={DeckCardsScreen}
        options={{ headerShown: false }}
      />
    </DeckStack.Navigator>
  );
};

export default function MainTabNavigator() {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#001f4d' }, 
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#001f4d' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#b0c4de',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={28} color={color} />
          ),
          headerShown: false,  // ← BU SATIRI EKLE
        }}
      />

      <Tab.Screen
        name="Create Card"
        component={CreateStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons name="plus-box-outline" size={30} color={color} />
          ),
          title: 'Create',
          headerStyle: {
            backgroundColor: '#001f4d',
          },
          headerTintColor: '#fff',
        }}
      />

      <Tab.Screen
        name="Deck"
        component={DeckStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "albums" : "albums-outline"} size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}