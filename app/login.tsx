import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, View, Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const storeAuthSession = useMutation(api.auth.storeAuthSession);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const redirectUri = process.env.EXPO_PUBLIC_WORKOS_REDIRECT_URI || 'exp://localhost:8081';

      const authUrl = `https://api.workos.com/user_management/authorize?client_id=${process.env.EXPO_PUBLIC_WORKOS_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&provider=authkit`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      if (result.type === 'success') {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        if (code) {
          // TODO: Exchange code for user info via backend API
          // For now, we'll mock the user data
          const mockUserData = {
            authProviderId: 'user_' + Math.random().toString(36).substring(7),
            authProvider: 'workos',
            email: 'user@example.com',
            firstName: 'Test',
            lastName: 'User',
          };

          // Store user in Convex
          const result = await storeAuthSession(mockUserData);

          console.log('User stored:', result);
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome to Topikku
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Sign in to continue
        </ThemedText>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? 'Signing in...' : 'Sign in with WorkOS'}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#6C47FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    marginTop: 16,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
