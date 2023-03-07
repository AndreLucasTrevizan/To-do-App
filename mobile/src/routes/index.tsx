import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useAuthContext } from '../contexts/AuthContext';
import AppRouter from './app.routes';
import AuthRouter from './auth.routes';

export default function Router() {
  const { signed, loading } = useAuthContext();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={60} color='#04B3CB' />
      </View>
    );
  }
  
  return (
    signed ? <AppRouter /> : <AuthRouter />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBEBEB'
  }
});
