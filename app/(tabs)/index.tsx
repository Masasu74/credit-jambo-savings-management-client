import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { me } from '../../src/services/auth';
import { getMySavingsAccounts, deposit, withdraw, getAllMyTransactions, mapAccountDTO, mapTransactionsDTO } from '../../src/services/savings';

export default function Home() {
  const [auth, setAuth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [tx, setTx] = useState<any[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [lowBalance, setLowBalance] = useState<boolean>(false);

  const refresh = async () => {
    try {
      const profile = await me();
      setAuth(profile?.customer || null);
      if (profile?.customer) {
        const acc = await getMySavingsAccounts();
        const mapped = (acc?.data || []).map(mapAccountDTO).filter(Boolean);
        setAccounts(mapped);
        setLowBalance(mapped.some((a: any) => a.balance < Math.max( (a.minimumBalance ?? 0), 1000)));
        const first = mapped?.[0]?.id;
        if (first) {
          setSelected(first);
        }
        
        // Load recent transactions from all accounts
        try {
          const allTx = await getAllMyTransactions(1, 10);
          if (allTx?.success && allTx?.data) {
            const txData = allTx.data;
            if (txData.transactions && Array.isArray(txData.transactions)) {
              const list = mapTransactionsDTO({ data: { transactions: txData.transactions } });
              setTx(list);
            } else if (Array.isArray(txData)) {
              const list = mapTransactionsDTO({ data: txData });
              setTx(list);
            } else {
              const list = mapTransactionsDTO(txData);
              setTx(list);
            }
          }
        } catch (e) {
          console.error('Error loading recent transactions:', e);
          setTx([]);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => { (async () => { await refresh(); setIsLoading(false); })(); }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  // auth is handled via dedicated /(auth) routes now

  const doDeposit = async () => {
    try {
      if (!selected) { setMsg('Select account'); return; }
      await deposit(selected, Number(amount));
      setAmount('');
      await refresh();
      setMsg('Deposit successful');
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  const doWithdraw = async () => {
    try {
      if (!selected) { setMsg('Select account'); return; }
      await withdraw(selected, Number(amount));
      setAmount('');
      await refresh();
      setMsg('Withdrawal successful');
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  if (isLoading) return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator color="#00b050" size="large" />
    </View>
  );
  if (!auth) return <Redirect href="/(auth)/sign-in" />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 pt-6 pb-24" refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#00b050" colors={["#00b050"]} /> }>
        <View className="mb-5 items-center">
          <Image source={require('../../assets/images/logo.png')} style={{ width: 200, height: 45, resizeMode: 'contain', marginBottom: 12 }} />
          <Text className="text-gray-500 text-center">Savings management made simple</Text>
        </View>
      {auth && auth.deviceVerified === false && (
        <View className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 mb-3">
          <Text className="text-yellow-800">Your device is not verified yet. Please contact admin to verify before you can login on this device.</Text>
        </View>
      )}
      {auth && lowBalance && (
        <View className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
          <Text className="text-red-700">Low balance warning: one or more accounts are below threshold.</Text>
        </View>
      )}
      {!!msg && <Text className="text-amber-600 mb-3">{msg}</Text>}

      {auth && (
        <View className="gap-5">
          <View className="bg-[#00b050] rounded-2xl p-5 shadow-md">
            <Text className="text-white text-xl font-bold mb-3">Welcome, {auth.fullName}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/accounts')} className="bg-white/20 rounded-xl px-4 py-3">
              <Text className="text-white text-center font-semibold">View All Savings Accounts</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-[#0f0d23] font-semibold mb-2">Your Accounts</Text>
            {accounts.map((a) => (
              <TouchableOpacity key={a.id || a._id} onPress={() => setSelected(a.id || a._id)} className={`rounded-2xl px-4 py-3 mb-2 border shadow-sm ${selected === (a.id||a._id) ? 'bg-[#00b050] border-[#00b050]' : 'bg-white border-gray-200'}`}>
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className={`${selected === (a.id||a._id) ? 'text-white' : 'text-[#0f0d23]'} font-bold text-lg`}>{a.accountNumber}</Text>
                    <Text className={`${selected === (a.id||a._id) ? 'text-white/80' : 'text-gray-500'} text-sm mt-1 capitalize`}>{a.accountType}</Text>
                  </View>
                  <View className="items-end">
                    <Text className={`${selected === (a.id||a._id) ? 'text-white' : 'text-[#00b050]'} font-bold text-xl`}>{new Intl.NumberFormat().format(a.balance)}</Text>
                    <Text className={`${selected === (a.id||a._id) ? 'text-white/80' : 'text-gray-500'} text-xs`}>RWF</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {!accounts.length && (
              <View className="rounded-2xl px-4 py-5 border border-dashed border-gray-300 bg-gray-50">
                <Text className="text-gray-600">You have no accounts yet. Create one to get started.</Text>
              </View>
            )}
          </View>

          <View className="flex-row gap-2 items-center mt-2">
            <TextInput placeholder="Amount" placeholderTextColor="#6b7280" keyboardType='numeric' className="flex-1 bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl" value={amount} onChangeText={setAmount} />
          </View>
          <View className="flex-row gap-3 mt-3">
            <TouchableOpacity disabled={!selected || !amount || Number(amount) <= 0} onPress={doDeposit} className={`flex-1 rounded-xl px-4 py-3 shadow-md ${(!selected || !amount || Number(amount)<=0) ? 'bg-[#00b050]/40' : 'bg-[#00b050]'}`}><Text className="text-white text-center font-semibold text-lg">{'Deposit'}</Text></TouchableOpacity>
            <TouchableOpacity disabled={!selected || !amount || Number(amount) <= 0} onPress={doWithdraw} className={`flex-1 rounded-xl px-4 py-3 shadow-md ${(!selected || !amount || Number(amount)<=0) ? 'bg-red-500/40' : 'bg-red-500'}`}><Text className="text-white text-center font-semibold text-lg">{'Withdraw'}</Text></TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')} className="mt-3 bg-white border-2 border-[#00b050] rounded-xl px-4 py-3">
            <Text className="text-[#00b050] text-center font-semibold">View All Transactions →</Text>
          </TouchableOpacity>

          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-[#0f0d23] font-semibold text-lg">Recent Transactions</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
                <Text className="text-[#00b050] font-semibold text-sm">View All →</Text>
              </TouchableOpacity>
            </View>
            {tx.length === 0 ? (
              <View className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <Text className="text-gray-600 text-center">No recent transactions</Text>
              </View>
            ) : (
              <View className="gap-2">
                {tx.map((t) => (
                  <TouchableOpacity 
                    key={t.id || t._id || t.transactionId || Math.random()} 
                    onPress={() => router.push('/(tabs)/transactions')} 
                    className="bg-white rounded-2xl border border-gray-200 px-4 py-3 shadow-sm"
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="text-[#0f0d23] font-bold capitalize">{t.type || 'Transaction'}</Text>
                        {t.description && (
                          <Text className="text-gray-500 text-xs mt-1">{t.description}</Text>
                        )}
                        <Text className="text-gray-500 text-xs mt-1">
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : ''}
                        </Text>
                      </View>
                      <View className="items-end ml-3">
                        <Text className={`font-bold text-lg ${t.type?.toLowerCase().includes('deposit') || t.type?.toLowerCase().includes('credit') ? 'text-[#00b050]' : 'text-red-500'}`}>
                          {t.type?.toLowerCase().includes('deposit') || t.type?.toLowerCase().includes('credit') ? '+' : '-'}
                          {new Intl.NumberFormat().format(Math.abs(t.amount || 0))} RWF
                        </Text>
                        {t.balanceAfter !== undefined && (
                          <Text className="text-gray-400 text-xs mt-1">
                            Balance: {new Intl.NumberFormat().format(t.balanceAfter || 0)} RWF
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}
