import { router } from "expo-router";
import { Button } from "react-native";

export default function Lock() {
    return (
        <>
            <Button title="CLICK" onPress={() => router.push('/(auth)/(tabs)/crypto')} />
        </>
    )
}