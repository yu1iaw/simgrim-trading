import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { MMKV } from "react-native-mmkv";



const storage = new MMKV({
    id: 'inactivity-storage',
})

export const UserInactivityProvider = ({ children }: any) => {
    const appStateRef = useRef(AppState.currentState);
    const { isSignedIn } = useAuth();

    useEffect(() => {
        const sub = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            sub.remove();
        }
    }, [])
    

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === "background") {
            recordStartTime();
        } else if (nextAppState === "active" && appStateRef.current === "background") {
            const elapsed = Date.now() - (storage.getNumber('startTime') ?? 0);
            if (elapsed > 900000 && isSignedIn) {
                router.replace('/(auth)/(modals)/lock');
            }
        }
        appStateRef.current = nextAppState;
    }

    const recordStartTime = () => {
        storage.set('startTime', Date.now())
    }


    return children;
}

