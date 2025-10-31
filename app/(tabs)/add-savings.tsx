import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { createMySavingsAccount, getAccountProducts } from '../../src/services/savings';

export default function AddSavingsScreen() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getAccountProducts();
      if (res?.success && res?.data) {
        setProducts(res.data);
      }
    } catch (e: any) {
      Alert.alert('Error', 'Failed to load account products');
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Please select an account product');
      return;
    }

    setSubmitting(true);
    try {
      const params: any = {
        productId: selectedProduct._id || selectedProduct.id,
        accountType: selectedProduct.accountType,
        minimumBalance: selectedProduct.minimumBalance || 0,
        interestRate: selectedProduct.interestRate || 0,
      };
      await createMySavingsAccount(params);
      Alert.alert('Success', 'Savings account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to create savings account');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#00b050" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 150 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="mb-6 items-center">
            <Image source={require('../../assets/images/logo.png')} style={{ width: 180, height: 40, resizeMode: 'contain', marginBottom: 12 }} />
            <Text className="text-[#00b050] text-3xl font-extrabold">Create Account</Text>
            <Text className="text-gray-500 mt-1 text-center">Choose an account product</Text>
          </View>

          {products.length === 0 ? (
            <View className="bg-gray-50 rounded-2xl p-5 border border-dashed border-gray-300">
              <Text className="text-gray-600 text-center">No account products available</Text>
            </View>
          ) : (
            <View className="gap-3 mb-4">
              <Text className="text-[#0f0d23] font-semibold text-lg mb-2">Select Account Product</Text>
              {products.map((product) => (
                <TouchableOpacity
                  key={product._id || product.id}
                  onPress={() => setSelectedProduct(product)}
                  className={`rounded-2xl p-4 border shadow-sm ${
                    selectedProduct?._id === product._id || selectedProduct?.id === product.id
                      ? 'bg-[#00b050] border-[#00b050]'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text
                        className={`font-bold text-lg ${
                          selectedProduct?._id === product._id || selectedProduct?.id === product.id
                            ? 'text-white'
                            : 'text-[#0f0d23]'
                        }`}
                      >
                        {product.productName}
                      </Text>
                      <Text
                        className={`text-xs mt-1 ${
                          selectedProduct?._id === product._id || selectedProduct?.id === product.id
                            ? 'text-white/80'
                            : 'text-gray-500'
                        }`}
                      >
                        {product.productCode}
                      </Text>
                      {product.description && (
                        <Text
                          className={`text-sm mt-2 ${
                            selectedProduct?._id === product._id || selectedProduct?.id === product.id
                              ? 'text-white/90'
                              : 'text-gray-600'
                          }`}
                        >
                          {product.description}
                        </Text>
                      )}
                    </View>
                    {selectedProduct?._id === product._id || selectedProduct?.id === product.id ? (
                      <View className="w-6 h-6 rounded-full bg-white items-center justify-center">
                        <Text className="text-[#00b050] font-bold">✓</Text>
                      </View>
                    ) : null}
                  </View>

                  <View
                    className={`flex-row flex-wrap gap-2 mt-3 pt-3 border-t ${
                      selectedProduct?._id === product._id || selectedProduct?.id === product.id
                        ? 'border-white/30'
                        : 'border-gray-100'
                    }`}
                  >
                    <View className="bg-white/20 rounded-lg px-3 py-1">
                      <Text
                        className={`text-xs font-semibold ${
                          selectedProduct?._id === product._id || selectedProduct?.id === product.id
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        Min: {new Intl.NumberFormat().format(product.minimumBalance || 0)} RWF
                      </Text>
                    </View>
                    <View className="bg-white/20 rounded-lg px-3 py-1">
                      <Text
                        className={`text-xs font-semibold ${
                          selectedProduct?._id === product._id || selectedProduct?.id === product.id
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        Interest: {product.interestRate || 0}%
                      </Text>
                    </View>
                    {product.monthlyFee > 0 && (
                      <View className="bg-white/20 rounded-lg px-3 py-1">
                        <Text
                          className={`text-xs font-semibold ${
                            selectedProduct?._id === product._id || selectedProduct?.id === product.id
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}
                        >
                          Fee: {new Intl.NumberFormat().format(product.monthlyFee)} RWF/mo
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedProduct && (
            <View className="bg-[#00b050]/10 rounded-2xl p-4 border border-[#00b050]/20 mb-4">
              <Text className="text-[#00b050] font-bold mb-2">Selected Product Details</Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Product Name</Text>
                  <Text className="text-[#0f0d23] font-semibold">{selectedProduct.productName}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Account Type</Text>
                  <Text className="text-[#0f0d23] font-semibold capitalize">{selectedProduct.accountType}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Minimum Balance</Text>
                  <Text className="text-[#0f0d23] font-semibold">
                    {new Intl.NumberFormat().format(selectedProduct.minimumBalance || 0)} RWF
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Interest Rate</Text>
                  <Text className="text-[#0f0d23] font-semibold">{selectedProduct.interestRate || 0}%</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            disabled={submitting || !selectedProduct}
            onPress={submit}
            className={`rounded-xl px-4 py-3 shadow-md ${
              submitting || !selectedProduct ? 'bg-[#00b050]/40' : 'bg-[#00b050]'
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {selectedProduct ? 'Create Account' : 'Select a Product First'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

