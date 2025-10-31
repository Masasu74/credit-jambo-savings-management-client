import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getToken, me } from '@/src/services/auth';

export default function TabLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        setAuthed(!!token);
        if (token) {
          try {
            const res = await me();
            setVerified(!!res?.customer?.deviceVerified);
          } catch {
            setVerified(null);
          }
        }
      } finally {
        setIsChecking(false);
      }
    })();
  }, []);

  if (isChecking) return null;
  if (!authed) return <Redirect href="/(auth)/sign-in" />;
  if (verified === false) return <Redirect href="/(auth)/not-verified" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00b050',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -4,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          marginHorizontal: 16,
          height: 85,
          position: 'absolute',
          bottom: 20,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          shadowOpacity: 0.12,
          elevation: 8,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? "house.fill" : "house"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? "creditcard.fill" : "creditcard"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? "list.bullet.rectangle.fill" : "list.bullet.rectangle"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-savings"
        options={{
          href: null, // Hide from tab bar but keep accessible
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? "person.fill" : "person"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
