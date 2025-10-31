import Constants from 'expo-constants';

function resolveBaseUrl(): string {
  const cfg: any = Constants as any;
  const fromExtra = cfg?.expoConfig?.extra?.apiBaseUrl;
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (fromExtra || fromEnv) return (fromExtra || fromEnv) as string;

  // Try to derive LAN URL from Expo host when running in Expo Go on device
  const debuggerHost: string | undefined = (cfg as any)?.expoGoConfig?.debuggerHost || (cfg as any)?.expoConfig?.hostUri;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:4000/api`;
    }
  }

  // Fallback for simulators and web
  return 'http://localhost:4000/api';
}

const base = resolveBaseUrl();

export const API_BASE = base;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const { headers: optionsHeaders, ...restOptions } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(optionsHeaders || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}
