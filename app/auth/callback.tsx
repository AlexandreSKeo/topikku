import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const storeAuthSession = useMutation(api.auth.storeAuthSession);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = params.code as string;
        const error = params.error as string;

        if (error) {
          console.error('Auth error:', error);
          router.replace('/login');
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          router.replace('/login');
          return;
        }

        // TODO: Exchange code for user info via your backend API
        // For now, using mock data
        const mockUserData = {
          authProviderId: 'user_' + Math.random().toString(36).substring(7),
          authProvider: 'workos',
          email: 'user@example.com',
          firstName: 'Test',
          lastName: 'User',
        };

        await storeAuthSession(mockUserData);
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Callback error:', error);
        router.replace('/login');
      }
    };

    handleCallback();
  }, [params]);

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" />
      <ThemedText style={styles.text}>Completing sign in...</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 16,
  },
});
