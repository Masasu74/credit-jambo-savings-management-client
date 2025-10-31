import 'react-native-get-random-values';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { v4 as uuidv4 } from 'uuid';
import { apiFetch, API_BASE } from './api';

const TOKEN_KEY = 'cj_token';
const DEVICE_KEY = 'cj_device_id';

async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_KEY);
  if (!id) {
    const devicePart = (Device.osBuildId || Device.deviceName || 'device');
    const platformId = `${devicePart}-${uuidv4()}`;
    id = platformId;
    await AsyncStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  // Optional profile fields (will be accepted by backend but not required)
  dob?: string; // ISO string or YYYY-MM-DD
  gender?: string;
  employmentStatus?: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
  jobTitle?: string;
  salary?: number | string;
  businessName?: string;
  monthlyRevenue?: number | string;
};

export async function register(payload: RegisterPayload) {
  const deviceId = await getDeviceId();
  return apiFetch('/customer-auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'x-device-id': deviceId, 'Content-Type': 'application/json' },
  });
}

export async function login(email: string, password: string) {
  const deviceId = await getDeviceId();
  const res = await fetch(`${API_BASE}/customer-auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'x-device-id': deviceId, 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) {
    const token = data?.token;
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
    return data;
  }
  // Gracefully handle device not verified case without throwing
  const message = (data?.message || '').toLowerCase();
  if (res.status === 403 && message.includes('device') && message.includes('verify')) {
    return { customer: { deviceVerified: false } };
  }
  throw new Error(data?.message || 'Login failed');
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function me() {
  const token = await getToken();
  if (!token) return null;
  const deviceId = await getDeviceId();
  return apiFetch('/customer-auth/me', {
    headers: { 
      Authorization: `Bearer ${token}`,
      'x-device-id': deviceId 
    },
  });
}

export async function authFetch(path: string, init: RequestInit = {}) {
  const token = await getToken();
  const deviceId = await getDeviceId();
  return apiFetch(path, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
      'x-device-id': deviceId,
    },
  });
}
