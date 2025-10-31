import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { me, getToken } from '../../src/services/auth';
import * as SecureStore from 'expo-secure-store';
import { Image } from 'react-native';

const TOKEN_KEY = 'cj_token';

export default function ProfileScreen() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await me();
      setCustomer(res?.customer || null);
    } catch (e) {
      console.error('Error loading profile:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#00b050" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 pt-6 pb-24">
        <View className="mb-6">
          <Text className="text-[#00b050] text-3xl font-extrabold">Profile</Text>
          <Text className="text-gray-500 mt-1">Manage your account</Text>
        </View>

        <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-4">
          <View className="items-center mb-5">
            <View className="w-24 h-24 rounded-full bg-[#00b050]/10 items-center justify-center mb-3">
              <Text className="text-[#00b050] text-3xl font-bold">
                {customer?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <Text className="text-[#0f0d23] text-2xl font-bold">{customer?.fullName || 'User'}</Text>
            <Text className="text-gray-500 mt-1">{customer?.email || ''}</Text>
            {customer?.customerCode && (
              <View className="mt-2 px-3 py-1 bg-[#00b050]/10 rounded-full">
                <Text className="text-[#00b050] font-semibold text-xs">Code: {customer.customerCode}</Text>
              </View>
            )}
          </View>

          <View className="border-t border-gray-100 pt-4 gap-3">
            {customer?.phone && (
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-600">Phone</Text>
                <Text className="text-[#0f0d23] font-semibold">{customer.phone}</Text>
              </View>
            )}
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Account Status</Text>
              <View className={`px-3 py-1 rounded-full ${
                customer?.deviceVerified ? 'bg-[#00b050]/10' : 'bg-yellow-100'
              }`}>
                <Text className={`text-xs font-semibold ${
                  customer?.deviceVerified ? 'text-[#00b050]' : 'text-yellow-700'
                }`}>
                  {customer?.deviceVerified ? 'Verified' : 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/add-savings')}
            className="bg-[#00b050] rounded-xl px-4 py-4 flex-row items-center justify-between"
          >
            <Text className="text-white font-semibold text-lg">Create Savings Account</Text>
            <Text className="text-white">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/transactions')}
            className="bg-white border border-[#00b050] rounded-xl px-4 py-4 flex-row items-center justify-between"
          >
            <Text className="text-[#00b050] font-semibold text-lg">View Transactions</Text>
            <Text className="text-[#00b050]">→</Text>
          </TouchableOpacity>

          <View className="mt-4">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-50 border border-red-200 rounded-xl px-4 py-4"
            >
              <Text className="text-red-600 text-center font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
