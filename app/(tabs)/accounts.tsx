import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getMySavingsAccounts, mapAccountDTO } from '../../src/services/savings';
import { me } from '../../src/services/auth';

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [auth, setAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const profile = await me();
      setAuth(profile?.customer || null);
      
      const accRes = await getMySavingsAccounts();
      const mapped = (accRes?.data || []).map(mapAccountDTO).filter(Boolean);
      setAccounts(mapped);
    } catch (e) {
      console.error('Error loading accounts:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#00b050" size="large" />
      </View>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5 pt-6 pb-24"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00b050" colors={["#00b050"]} />}
      >
        <View className="mb-5 items-center">
          <Image source={require('../../assets/images/logo.png')} style={{ width: 180, height: 40, resizeMode: 'contain', marginBottom: 12 }} />
          <Text className="text-[#00b050] text-3xl font-extrabold">My Accounts</Text>
          <Text className="text-gray-500 mt-1 text-center">Manage your savings accounts</Text>
        </View>

        {auth && (
          <View className="mb-4">
            <View className="bg-[#00b050] rounded-2xl p-5 shadow-md">
              <Text className="text-white/80 text-sm mb-1">Total Balance</Text>
              <Text className="text-white text-3xl font-bold">
                {new Intl.NumberFormat().format(totalBalance)} RWF
              </Text>
              <Text className="text-white/80 text-xs mt-2">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
        )}

        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[#0f0d23] font-semibold text-lg">Savings Accounts</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/add-savings')}
              className="bg-[#00b050] rounded-xl px-4 py-2 shadow-md"
            >
              <Text className="text-white font-semibold text-sm">+ Add Account</Text>
            </TouchableOpacity>
          </View>

          {accounts.length === 0 ? (
            <View className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-300 items-center">
              <Text className="text-gray-600 text-center mb-4">No savings accounts yet</Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/add-savings')}
                className="bg-[#00b050] rounded-xl px-6 py-3 shadow-md"
              >
                <Text className="text-white font-semibold">Create Your First Account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-3">
              {accounts.map((acc) => (
                <TouchableOpacity
                  key={acc.id || acc._id}
                  onPress={() => router.push(`/(tabs)/index`)}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-[#0f0d23] font-bold text-lg">{acc.accountNumber}</Text>
                      <Text className="text-gray-500 text-sm mt-1 capitalize">{acc.accountType}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[#00b050] font-bold text-xl">
                        {new Intl.NumberFormat().format(acc.balance)} RWF
                      </Text>
                      <Text className="text-gray-400 text-xs">Balance</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2 mt-2 pt-2 border-t border-gray-100">
                    <View className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                      <Text className="text-gray-500 text-xs">Minimum</Text>
                      <Text className="text-[#0f0d23] font-semibold text-sm">
                        {new Intl.NumberFormat().format(acc.minimumBalance || 0)} RWF
                      </Text>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                      <Text className="text-gray-500 text-xs">Status</Text>
                      <View className={`mt-1 ${acc.isVerified ? 'bg-[#00b050]/10' : 'bg-yellow-100'} px-2 py-1 rounded-full self-start`}>
                        <Text className={`text-xs font-semibold ${acc.isVerified ? 'text-[#00b050]' : 'text-yellow-700'}`}>
                          {acc.isVerified ? 'Verified' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {accounts.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/add-savings')}
            className="bg-white border-2 border-[#00b050] rounded-xl px-4 py-3 mt-4 shadow-sm"
          >
            <Text className="text-[#00b050] text-center font-semibold">+ Create New Account</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

