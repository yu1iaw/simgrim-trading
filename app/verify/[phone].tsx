import { Fragment, useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { isClerkAPIResponseError, useAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import tw from 'twrnc';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { defaultStyles } from "@/constants/Styles";


const CELL_COUNT = 6;

export default function Verify() {
    const [code, setCode] = useState("");
    const { phone, signin } = useLocalSearchParams();
    const { signIn } = useSignIn();
    const { signUp, setActive } = useSignUp();

    const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });


    useEffect(() => {
        if (code.length === 6) {
            if (signin === "true") {
                verifyLogin();
            } else {
                verifyCode();
            }
        }
    }, [code])


    const verifyCode = async () => {
        try {
            await signUp!.attemptPhoneNumberVerification({
                code

            })
            await setActive!({ session: signUp!.createdSessionId });
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                console.log(error.errors[0]);
                Alert.alert('Error', error.errors[0].longMessage);
            }
        }
    }

    const verifyLogin = async () => {
        try {
            await signIn!.attemptFirstFactor({
                strategy: 'phone_code',
                code
            })
            await setActive!({ session: signIn!.createdSessionId });

        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                console.log(error.errors[0]);
                Alert.alert('Error', error.errors[0].message);
            }
        }
    }


    return (
        <View style={defaultStyles.container}>
            <Text style={defaultStyles.header}>6-digit code</Text>
            <Text style={defaultStyles.descriptionText}>
                Code sent to {phone} unless you already have an account.
            </Text>
            <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={code}
                onChangeText={setCode}
                cellCount={CELL_COUNT}
                rootStyle={tw`top-26`}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
                testID="my-code-input"
                renderCell={({ index, symbol, isFocused }) => (
                    <Fragment key={index}>
                        <View style={tw`w-11 h-11 justify-center items-center rounded border ${isFocused ? 'border-sky-600' : 'border-gray-600'}`}>
                            <Text
                                style={tw`text-xl`}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        </View>
                        {index === 2 && <View style={tw`h-[2px] w-3 self-center bg-gray-600`} />}
                    </Fragment>
                )}
            />
        </View>
    )
}


