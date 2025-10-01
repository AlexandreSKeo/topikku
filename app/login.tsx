import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const handleLogin = async () => {
    try {
      // In a real app, you would get this from your backend
      const redirectUri = 'exp://localhost:8081';

      // For now, we'll use a placeholder URL - you'll need to implement a backend endpoint
      const authUrl = `https://api.workos.com/user_management/authorize?client_id=${process.env.EXPO_PUBLIC_WORKOS_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&provider=authkit`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      if (result.type === 'success') {
        // Handle the authorization code
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        if (code) {
          // Send code to your backend to exchange for tokens
          console.log('Authorization code:', code);
          // After successful authentication, navigate to home
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
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
          ]}
          onPress={handleLogin}
        >
          <ThemedText style={styles.buttonText}>
            Sign in with WorkOS
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
