import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { register as registerFn } from '../../src/services/auth';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [gender, setGender] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmploymentOpen, setIsEmploymentOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const employmentOptions = ['employed', 'self-employed', 'unemployed', 'student', 'retired'];
  const genderOptions = ['Male', 'Female'];

  const onDobPartChange = (year?: string, month?: string, day?: string) => {
    const y = year !== undefined ? year : dobYear;
    const m = month !== undefined ? month : dobMonth;
    const d = day !== undefined ? day : dobDay;
    setDobYear(y);
    setDobMonth(m);
    setDobDay(d);
    if (y && m && d) {
      const mm = m.padStart(2, '0');
      const dd = d.padStart(2, '0');
      setDob(`${y}-${mm}-${dd}`);
    }
  };

  const submit = async () => {
    // Required fields
    if (!fullName || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill in full name, email, phone and password');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Phone validation (basic)
    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // DOB age check (optional)
    if (dob) {
      const today = new Date();
      const birth = new Date(dob);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 18) {
        Alert.alert('Error', 'You must be at least 18 years old');
        return;
      }
    }

    // Employment-specific validation (optional)
    if (employmentStatus === 'employed' && !jobTitle) {
      Alert.alert('Error', 'Please provide job title for employed status');
      return;
    }
    if (employmentStatus === 'self-employed' && !businessName) {
      Alert.alert('Error', 'Please provide business name for self-employed status');
      return;
    }

    if (!isConfirmed) {
      Alert.alert('Error', 'Please confirm that the information provided is correct');
      return;
    }
    setIsSubmitting(true);
    try {
      // Send extended fields; backend persists what it supports
      await registerFn({ fullName, email, password, phone, dob, gender, employmentStatus: employmentStatus as any, jobTitle, salary, businessName, monthlyRevenue });
      Alert.alert('Success', 'Registration successful. Please ask admin to verify your device, then login.');
      router.replace('/(auth)/sign-in');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to sign up');
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
            <Text className="text-[#00b050] text-3xl font-extrabold">Create account</Text>
            <Text className="text-gray-500 mt-1">Join Credit Jambo</Text>
          </View>

          <View className="bg-white rounded-2xl p-5 border border-gray-200">
            <Text className="text-[#0f0d23] text-xl font-bold mb-4">Sign up</Text>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl mb-3"
              value={fullName}
              onChangeText={setFullName}
            />
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
              placeholder="Phone"
              placeholderTextColor="#6b7280"
              className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl mb-3"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <View className="flex-row gap-3 mb-3">
              <TextInput
                placeholder="YYYY"
                placeholderTextColor="#6b7280"
                keyboardType="number-pad"
                maxLength={4}
                className="flex-1 bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl"
                value={dobYear}
                onChangeText={(t) => onDobPartChange(t.replace(/[^0-9]/g, ''))}
              />
              <TextInput
                placeholder="MM"
                placeholderTextColor="#6b7280"
                keyboardType="number-pad"
                maxLength={2}
                className="w-20 bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl"
                value={dobMonth}
                onChangeText={(t) => onDobPartChange(undefined, t.replace(/[^0-9]/g, ''))}
              />
              <TextInput
                placeholder="DD"
                placeholderTextColor="#6b7280"
                keyboardType="number-pad"
                maxLength={2}
                className="w-20 bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl"
                value={dobDay}
                onChangeText={(t) => onDobPartChange(undefined, undefined, t.replace(/[^0-9]/g, ''))}
              />
            </View>
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <Pressable onPress={() => setIsGenderOpen((v) => !v)} className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200">
                  <Text className={gender ? 'text-[#0f0d23]' : 'text-gray-500'}>{gender || 'Select Gender'}</Text>
                </Pressable>
                {isGenderOpen && (
                  <View className="mt-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
                    {genderOptions.map((opt) => (
                      <Pressable key={opt} onPress={() => { setGender(opt); setIsGenderOpen(false); }} className="px-4 py-3 border-b border-gray-100">
                        <Text className={`${gender === opt ? 'text-[#00b050] font-semibold' : 'text-[#0f0d23]'}`}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
              <View className="flex-1">
                <Pressable onPress={() => setIsEmploymentOpen((v) => !v)} className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200">
                  <Text className={`text-${employmentStatus ? '[#0f0d23]' : 'gray-500'}`}>{employmentStatus ? employmentStatus : 'Select Employment Status'}</Text>
                </Pressable>
                {isEmploymentOpen && (
                  <View className="mt-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
                    {employmentOptions.map((opt) => (
                      <Pressable key={opt} onPress={() => { setEmploymentStatus(opt); setIsEmploymentOpen(false); }} className="px-4 py-3 border-b border-gray-100">
                        <Text className={`capitalize ${employmentStatus === opt ? 'text-[#00b050] font-semibold' : 'text-[#0f0d23]'}`}>{opt.replace('-', ' ')}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>
            {employmentStatus === 'employed' && (
              <View className="mb-3">
                <TextInput
                  placeholder="Job Title"
                  placeholderTextColor="#6b7280"
                  className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl mb-3"
                  value={jobTitle}
                  onChangeText={setJobTitle}
                />
                <TextInput
                  placeholder="Monthly Salary (RWF)"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl"
                  value={salary}
                  onChangeText={setSalary}
                />
              </View>
            )}
            {employmentStatus === 'self-employed' && (
              <View className="mb-3">
                <TextInput
                  placeholder="Business Name"
                  placeholderTextColor="#6b7280"
                  className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl mb-3"
                  value={businessName}
                  onChangeText={setBusinessName}
                />
                <TextInput
                  placeholder="Monthly Revenue (RWF)"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl"
                  value={monthlyRevenue}
                  onChangeText={setMonthlyRevenue}
                />
              </View>
            )}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6b7280"
              secureTextEntry
              className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl mb-4"
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#6b7280"
              secureTextEntry
              className="bg-gray-100 text-[#0f0d23] px-4 py-3 rounded-xl mb-4"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity onPress={() => setIsConfirmed(!isConfirmed)} className="flex-row items-center mb-4">
              <View className={`w-5 h-5 mr-2 rounded border ${isConfirmed ? 'bg-[#00b050] border-[#00b050]' : 'border-gray-400'}`} />
              <Text className="text-gray-700">I confirm that the information provided is correct</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={isSubmitting} onPress={submit} className={`rounded-xl px-4 py-3 ${isSubmitting ? 'bg-[#00b050]/40' : 'bg-[#00b050]'}`}>
              <Text className="text-white text-center font-semibold">{isSubmitting ? 'Creating...' : 'Create account'}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center gap-2 mt-6">
            <Text className="text-gray-600">Already have an account?</Text>
            <Link href="/(auth)/sign-in" className="text-[#00b050] font-semibold">Sign in</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


