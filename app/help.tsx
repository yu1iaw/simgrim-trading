import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Button } from "react-native";

export default function Help() {
    const { isSignedIn, sessionId } = useAuth();
    console.log('signed in: ', isSignedIn);
    return (
        <Button title="Click" onPress={() => router.push('/(tabs)/settings')} />
    )
}