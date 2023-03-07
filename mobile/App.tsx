import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import Router from './src/routes';
import { StatusBar } from 'react-native';
import AuthProvider from './src/contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor='#EBEBEB' barStyle='dark-content' />
        <Router />
        <Toast />
      </AuthProvider>
    </NavigationContainer>
  );
}