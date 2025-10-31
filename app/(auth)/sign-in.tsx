import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { login } from '../../src/services/auth';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter valid email & password');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await login(email, password);
      const verified = data?.customer?.deviceVerified;
      if (verified) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/not-verified');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView className="flex-1 px-5 pt-10" keyboardShouldPersistTaps="handled">
          <View className="mb-8 items-center">
            <Image source={require('../../assets/images/logo.png')} style={{ width: 180, height: 40, resizeMode: 'contain' }} />
          </View>
          <View className="mb-4">
            <Text className="text-[#00b050] text-3xl font-extrabold">Welcome back</Text>
            <Text className="text-gray-500 mt-1">Sign in to continue</Text>
          </View>

          <View className="bg-white rounded-2xl p-5 border border-gray-200">
            <Text className="text-[#0f0d23] text-xl font-bold mb-4">Sign in</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#6b7280"
              className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl mb-3"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6b7280"
              secureTextEntry
              className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl mb-4"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity disabled={isSubmitting} onPress={submit} className={`rounded-xl px-4 py-3 ${isSubmitting ? 'bg-[#00b050]/50' : 'bg-[#00b050]'}`}>
              <Text className="text-white text-center font-semibold">{isSubmitting ? 'Signing in...' : 'Continue'}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center gap-2 mt-6">
            <Text className="text-gray-600">Don't have an account?</Text>
            <Link href="/(auth)/sign-up" className="text-[#00b050] font-semibold">Sign up</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


