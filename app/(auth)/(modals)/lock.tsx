import { useEffect, useState } from "react";
import tw from 'twrnc';
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as LocalAuthentication from 'expo-local-authentication';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";



const OFFSET = 20, TIME = 80;

export default function Lock() {
    const { user } = useUser();
    const [code, setCode] = useState<number[]>([]);
    const [firstName] = useState(user?.firstName);
    const offset = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }],
        }
    })

    
    useEffect(() => {
        if (code.length === 6) {
            if (code.join('') === '123456') {
                return router.replace('/(auth)/(tabs)/home');
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            offset.value = withSequence(
                withTiming(-OFFSET, { duration: TIME / 2 }),
                withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
                withTiming(0, {duration: TIME / 2})
            )
        }
    }, [code])


    const onNumberPress = (number: number) => {
        if (code.length === 6) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode([...code, number]);
    }

    const onBackspacePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode(code.slice(0, -1));
    }

    const onBiometricAuthPress = async () => {
        const { success } = await LocalAuthentication.authenticateAsync();
        if (success) {
            return router.replace('/(auth)/(tabs)/home');
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }


    return (
        <SafeAreaView style={tw`flex-1 bg-white items-center`}>
            <Text style={tw`text-2xl font-bold mt-6`}>Welcome back, {firstName}!</Text>
            <Animated.View style={[{flexDirection: "row", marginVertical: 120, columnGap: 12}, style]}>
                {Array(6).fill(0).map((_, index) => (
                    <View
                        key={index}
                        style={tw`w-8 h-8 justify-center items-center rounded-full ${index in code ? 'bg-sky-900' : 'bg-gray-300'}`}
                    />
                ))}
            </Animated.View>
            <View style={tw`max-w-[65%]`}>
                <View style={tw`flex-row items-center justify-evenly flex-wrap gap-x-11 gap-y-6`}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'icon', 'backspace'].map(num => {
                        return typeof num === "number" ? (
                            <TouchableOpacity
                                key={num}
                                onPress={() => onNumberPress(num)}
                                style={tw`p-2 rounded-full ${!num ? 'ml-2' : ''}`}
                            >
                                <Text style={tw`text-3xl`}>{num}</Text>
                            </TouchableOpacity>
                        ) : num === "icon" ? (
                            <TouchableOpacity onPress={onBiometricAuthPress} key={num} style={tw`p-2 mr-1 rounded-full`}>
                                <MaterialCommunityIcons name="face-recognition" size={32} />
                            </TouchableOpacity>
                        ) : (
                            code.length > 0 && (
                                <TouchableOpacity
                                    key={num}
                                    onPress={onBackspacePress}
                                    style={tw`p-2 -ml-3 rounded-full`}
                                >
                                    <MaterialCommunityIcons name="backspace-outline" size={32} />
                                </TouchableOpacity>
                            )
                        )
                    })}
                </View>
            </View>
        </SafeAreaView>
    )
}