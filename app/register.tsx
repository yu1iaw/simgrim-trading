import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Link, router } from "expo-router";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";



export default function Register() {
    const [countryCode, setCountryCode] = useState("+15");
    const [phoneNumber, setPhoneNumber] = useState("");
    const isIos = Platform.OS === "ios";
    const { signUp } = useSignUp();
    
    const onRegister = async () => {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
        try {
            await signUp?.create({
                phoneNumber: fullPhoneNumber,
            })
            signUp!.preparePhoneNumberVerification();
            router.push(`/verify/${fullPhoneNumber}`);
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                console.log(error.errors[0].longMessage);
            }
        }
    }

    return (
        <KeyboardAvoidingView style={tw`flex-1`} behavior={ isIos ? "padding" : "height"} keyboardVerticalOffset={isIos ? 90 : 0}>
            <View style={defaultStyles.container}>
                <View style={tw`flex-1`}>
                    <Text style={defaultStyles.header}>Let's get started!</Text>
                    <Text style={defaultStyles.descriptionText}>
                        Enter your phone number. We will send you a confirmation code there.
                    </Text>
                    <View style={tw`flex-row my-10 gap-3`}>
                        <TextInput
                            placeholder="Country code"
                            placeholderTextColor={Colors.gray}
                            value={countryCode}
                            style={tw`flex-1 bg-gray-200 p-5 rounded-lg text-base`}
                        />
                        <TextInput
                            placeholder="Mobile number"
                            placeholderTextColor={Colors.gray}
                            keyboardType="numeric"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            style={tw`flex-3 bg-gray-200 p-5 rounded-lg text-base`}
                        />
                    </View>
                    <Link href={'/login'} replace asChild>
                        <TouchableOpacity>
                            <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
                <TouchableOpacity
                    onPress={onRegister}
                    style={[defaultStyles.pillButton, { backgroundColor: phoneNumber ? Colors.primary : Colors.primaryMuted }]}
                >
                    <Text style={defaultStyles.buttonText}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}