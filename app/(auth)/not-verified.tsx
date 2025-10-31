import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { me } from '../../src/services/auth';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'cj_token';

export default function NotVerifiedScreen() {
  const [checking, setChecking] = useState(false);
  const [lastCheckMessage, setLastCheckMessage] = useState<string | null>(null);

  const checkAgain = async () => {
    setChecking(true);
    setLastCheckMessage(null);
    try {
      const res = await me();
      const deviceVerified = res?.customer?.deviceVerified;
      
      if (deviceVerified === true) {
        // Device is verified, navigate to tabs
        setLastCheckMessage('Device verified! Redirecting...');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      } else if (deviceVerified === false) {
        // Still not verified
        setLastCheckMessage('Still pending verification. Please wait for admin approval.');
      } else {
        // Response doesn't have expected structure
        setLastCheckMessage('Unable to check status. Please try again.');
        console.warn('Unexpected response structure:', res);
      }
    } catch (e: any) {
      // Error checking status - user can try again
      console.error('Error checking verification:', e);
      setLastCheckMessage('Error checking status. Please try again.');
      Alert.alert('Error', 'Failed to check verification status. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            router.replace('/(auth)/sign-in');
          } catch (e) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Image source={require('../../assets/images/logo.png')} style={{ width: 180, height: 40, resizeMode: 'contain', marginBottom: 24 }} />
        <Text className="text-[#0f0d23] text-2xl font-extrabold mb-2">Device verification pending</Text>
        <Text className="text-gray-600 text-center mb-6">
          Your device isn't verified yet. Please wait for an admin to verify your device. You can refresh below.
        </Text>
        
        {lastCheckMessage && (
          <View className="mb-4 px-4 py-3 bg-gray-100 rounded-xl">
            <Text className="text-gray-700 text-center text-sm">{lastCheckMessage}</Text>
          </View>
        )}
        
        <TouchableOpacity 
          disabled={checking} 
          onPress={checkAgain} 
          className={`rounded-xl px-5 py-3 mb-4 ${checking ? 'bg-[#00b050]/40' : 'bg-[#00b050]'}`}
        >
          {checking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Check again</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mt-2"
        >
          <Text className="text-red-600 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


