import { useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Link, Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserInactivityProvider } from '@/hooks/useUserInactivity';
import Colors from '@/constants/Colors';

const client = new QueryClient();
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      return;
    }
  }
}


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();


  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!inAuthGroup && isSignedIn) {
      router.replace('/(auth)/(tabs)/home');
    } else if (!isSignedIn) {
      router.replace('/');
    }
  }, [isSignedIn])


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded || !isLoaded) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen
        name='register'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name='login'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href='/help' asChild>
              <TouchableOpacity>
                <Ionicons name="information-circle-outline" size={34} color={Colors.dark} />
              </TouchableOpacity>
            </Link>
          )
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: "Help",
          headerTitleAlign: "center",
          presentation: "modal"
        }}
      />
      <Stack.Screen
        name="(auth)/(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/crypto/[id]"
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity style={tw`pr-3`} onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={tw`flex-row items-center gap-3`}>
              <TouchableOpacity style={tw`p-1`}>
                <Ionicons name="notifications-outline" size={30} color={Colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity style={tw`p-1 mb-1`}>
                <Ionicons name="star-outline" size={30} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          ),
          headerLargeTitle: true,
          headerTransparent: true,

        }}
      />
      <Stack.Screen name="(auth)/(modals)/lock" options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen
        name='verify/[phone]'
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          )
        }}
      />

    </Stack>
  );
}

export default function RootLayoutNav() {
  return (
    <QueryClientProvider client={client}>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
        <UserInactivityProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <InitialLayout />
          </GestureHandlerRootView>
        </UserInactivityProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
