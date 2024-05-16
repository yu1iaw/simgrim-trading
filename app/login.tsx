import { useState } from "react";
import { router } from "expo-router";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Ionicons } from "@expo/vector-icons";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";



enum LoginType {
    Phone,
    Email,
    Google,
    Apple
};

export default function Login() {
    const [countryCode, setCountryCode] = useState("+15");
    const [phoneNumber, setPhoneNumber] = useState("");
    const isIos = Platform.OS === "ios";
    const { signIn } = useSignIn();


    const login = async (type: LoginType) => {
        if (type === LoginType.Phone) {
            try {
                const fullPhoneNumber = `${countryCode}${phoneNumber}`;
              
                const { supportedFirstFactors } = await signIn!.create({
                    identifier: fullPhoneNumber,
                })
                const firstPhoneFactor: any = supportedFirstFactors.find((factor: any) => factor.strategy === 'phone_code');
                const { phoneNumberId } = firstPhoneFactor;

                await signIn?.prepareFirstFactor({
                    strategy: "phone_code",
                    phoneNumberId
                })

                router.push({ pathname: '/verify/[phone]', params: { phone: fullPhoneNumber, signin: 'true' } });
            } catch (error) {
                if (isClerkAPIResponseError(error)) {
                    if (error.errors[0].code === "form_identifier_not_found") {
                        Alert.alert('Error', error.errors[0].message);
                    }
                }
            }
        }
    }

    return (
        <KeyboardAvoidingView style={tw`flex-1`} behavior={isIos ? "padding" : "height"} keyboardVerticalOffset={isIos ? 90 : 0}>
            <View style={defaultStyles.container}>
                <View style={tw`flex-1`}>
                    <Text style={defaultStyles.header}>Welcome back!</Text>
                    <Text style={defaultStyles.descriptionText}>
                        Enter your phone number associated with your account.
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
                    <TouchableOpacity
                        onPress={() => login(LoginType.Phone)}
                        style={[defaultStyles.pillButton, { backgroundColor: phoneNumber ? Colors.primary : Colors.primaryMuted }]}
                    >
                        <Text style={defaultStyles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                    <View style={tw`flex-row items-center gap-x-5 my-8`}>
                        <View style={tw.style(`flex-1 bg-gray-400`, { height: StyleSheet.hairlineWidth })} />
                        <Text style={tw`text-base text-stone-600`}>or</Text>
                        <View style={tw.style(`flex-1 bg-gray-400`, { height: StyleSheet.hairlineWidth })} />
                    </View>
                    <View style={tw`gap-y-3`}>
                        <TouchableOpacity
                            onPress={() => login(LoginType.Email)}
                            style={tw.style(`bg-white flex-row items-center gap-x-4 shadow-sm`, defaultStyles.pillButton)}
                        >
                            <View style={tw`flex-1 items-end`}>
                                <Ionicons name="mail" size={24} />
                            </View>
                            <Text style={tw.style(`flex-3 text-base text-gray-900 font-bold`)}>Continue with email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => login(LoginType.Google)}
                            style={tw.style(`bg-white flex-row items-center gap-x-4 shadow-sm`, defaultStyles.pillButton)}
                        >
                            <View style={tw`flex-1 items-end`}>
                                <Ionicons name="logo-google" size={24} />
                            </View>
                            <Text style={tw.style(`flex-3 text-base text-gray-900 font-bold`)}>Continue with Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => login(LoginType.Apple)}
                            style={tw.style(`bg-white flex-row items-center gap-x-4 shadow-sm`, defaultStyles.pillButton)}
                        >
                            <View style={tw`flex-1 items-end`}>
                                <Ionicons name="logo-apple" size={26} />
                            </View>
                            <Text style={tw.style(`flex-3 text-base text-gray-900 font-bold`)}>Continue with Apple</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}