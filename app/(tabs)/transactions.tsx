import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMySavingsAccounts, getAccountHistory, getAllMyTransactions, mapAccountDTO, mapTransactionsDTO } from '../../src/services/savings';
import { router } from 'expo-router';

export default function TransactionsScreen() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const acc = await getMySavingsAccounts();
      const mapped = (acc?.data || []).map(mapAccountDTO).filter(Boolean);
      setAccounts(mapped);
      if (mapped.length > 0 && selectedAccount === 'all') {
        // Load all transactions by default
        await loadAllTransactions();
      }
    } catch (e) {
      console.error('Error loading accounts:', e);
    }
  };

  const loadAllTransactions = async () => {
    try {
      const allTx = await getAllMyTransactions(1, 100);
      console.log('All transactions response:', allTx);
      if (allTx?.success && allTx?.data) {
        // Handle the structure: { data: { transactions: [...], pagination: {...} } }
        const txData = allTx.data;
        if (txData.transactions && Array.isArray(txData.transactions)) {
          const list = mapTransactionsDTO({ data: { transactions: txData.transactions } });
          setTransactions(list);
        } else if (Array.isArray(txData)) {
          // If data is directly an array
          const list = mapTransactionsDTO({ data: txData });
          setTransactions(list);
        } else {
          // Fallback: try to map directly
          const list = mapTransactionsDTO(txData);
          setTransactions(list);
        }
      } else {
        console.warn('No transactions data:', allTx);
        setTransactions([]);
      }
    } catch (e: any) {
      console.error('Error loading all transactions:', e);
      console.error('Error message:', e?.message);
      setTransactions([]);
    }
  };

  const loadTransactions = async () => {
    if (!selectedAccount || selectedAccount === 'all') {
      await loadAllTransactions();
      return;
    }
    try {
      const history = await getAccountHistory(selectedAccount, 1, 50);
      console.log('Account history response:', history);
      // Handle the structure from getAccountHistory
      // getAccountHistory returns: { success: true, data: { transactions: [...], pagination: {...} } }
      if (history?.success && history?.data) {
        const txData = history.data;
        if (txData.transactions && Array.isArray(txData.transactions)) {
          const list = mapTransactionsDTO({ data: { transactions: txData.transactions } });
          setTransactions(list);
        } else {
          const list = mapTransactionsDTO(history);
          setTransactions(list);
        }
      } else {
        const list = mapTransactionsDTO(history);
        setTransactions(list);
      }
    } catch (e: any) {
      console.error('Error loading transactions:', e);
      console.error('Error message:', e?.message);
      // Fallback to all transactions on error
      await loadAllTransactions();
    }
  };

  useEffect(() => {
    (async () => {
      await loadData();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selectedAccount && !loading) {
      loadTransactions();
    }
  }, [selectedAccount]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    if (selectedAccount) {
      await loadTransactions();
    }
    setRefreshing(false);
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
      <ScrollView
        className="flex-1 px-5 pt-6 pb-24"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00b050" colors={["#00b050"]} />}
      >
        <View className="mb-5 items-center">
          <Image source={require('../../assets/images/logo.png')} style={{ width: 180, height: 40, resizeMode: 'contain', marginBottom: 12 }} />
          <Text className="text-[#00b050] text-3xl font-extrabold">Transactions</Text>
          <Text className="text-gray-500 mt-1 text-center">View your account activity</Text>
        </View>

        {accounts.length > 0 && (
          <View className="mb-4">
            <Text className="text-[#0f0d23] font-semibold mb-2">Select Account</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setSelectedAccount('all')}
                  className={`rounded-xl px-4 py-2 border ${
                    selectedAccount === 'all'
                      ? 'bg-[#00b050] border-[#00b050]'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedAccount === 'all' ? 'text-white' : 'text-[#0f0d23]'
                    }`}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {accounts.map((a) => (
                  <TouchableOpacity
                    key={a.id || a._id}
                    onPress={() => setSelectedAccount(a.id || a._id)}
                    className={`rounded-xl px-4 py-2 border ${
                      selectedAccount === (a.id || a._id)
                        ? 'bg-[#00b050] border-[#00b050]'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedAccount === (a.id || a._id) ? 'text-white' : 'text-[#0f0d23]'
                      }`}
                    >
                      {a.accountNumber}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {!accounts.length && (
          <View className="bg-gray-50 rounded-2xl p-5 border border-dashed border-gray-300 mb-4">
            <Text className="text-gray-600 text-center mb-3">No accounts found</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/add-savings')}
              className="bg-[#00b050] rounded-xl px-4 py-3"
            >
              <Text className="text-white text-center font-semibold">Create Account</Text>
            </TouchableOpacity>
          </View>
        )}

        <View>
          <Text className="text-[#0f0d23] font-semibold mb-3">
            {selectedAccount === 'all' ? 'All Transactions' : 'Transaction History'}
          </Text>
          {transactions.length === 0 ? (
            <View className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <Text className="text-gray-600 text-center">No transactions found</Text>
            </View>
          ) : (
              <View className="gap-3">
                {transactions.map((t) => (
                  <View
                    key={t.id || t._id}
                    className="bg-white rounded-2xl border border-gray-200 px-4 py-4 shadow-sm"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-[#0f0d23] font-bold text-lg capitalize">{t.type || 'Transaction'}</Text>
                        {t.description && (
                          <Text className="text-gray-600 mt-1">{t.description}</Text>
                        )}
                      </View>
                      <View className="items-end">
                        <Text
                          className={`font-bold text-lg ${
                            t.type?.toLowerCase().includes('deposit') || t.type?.toLowerCase().includes('credit')
                              ? 'text-[#00b050]'
                              : 'text-red-500'
                          }`}
                        >
                          {t.type?.toLowerCase().includes('deposit') || t.type?.toLowerCase().includes('credit')
                            ? '+'
                            : '-'}
                          {new Intl.NumberFormat().format(Math.abs(t.amount))} RWF
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                          Balance: {new Intl.NumberFormat().format(t.balanceAfter || 0)} RWF
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
                      <Text className="text-gray-500 text-xs">
                        {new Date(t.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${
                          t.status === 'completed' || t.status === 'success'
                            ? 'bg-[#00b050]/10'
                            : t.status === 'pending'
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold capitalize ${
                            t.status === 'completed' || t.status === 'success'
                              ? 'text-[#00b050]'
                              : t.status === 'pending'
                              ? 'text-yellow-700'
                              : 'text-red-700'
                          }`}
                        >
                          {t.status || 'completed'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

