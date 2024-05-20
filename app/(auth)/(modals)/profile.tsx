import { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { useAuth, useUser } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';



const ICONS = [
    {
        name: "Default",
        icon: require("@/assets/images/icon.png")
    },
    {
        name: "Dark",
        icon: require("@/assets/images/icon-dark.png")
    },
    {
        name: "Vivid",
        icon: require("@/assets/images/icon-vivid.png")
    },
]

export default function Profile() {
    const { user } = useUser();
    const [firstName, setFirstName] = useState(user?.firstName ?? '');
    const [lastName, setLastName] = useState(user?.lastName ?? '');
    const [activeIcon, setActiveIcon] = useState("Default");
    const [edit, setEdit] = useState(false);
    const { signOut } = useAuth();
    const headerHeight = useHeaderHeight();


    const onCaptureImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
            try {
                await user?.setProfileImage({
                    file: base64
                });
            } catch (e) {
                console.log(e);
            }
        }
    }

    const onSaveUser = async () => {
        if (!firstName || !lastName) return;
        try {
            await user?.update({
                firstName,
                lastName
            })
        } catch (e) {
            console.log(e);   
        } finally {
            setEdit(!edit);
        }
    }


    if (!user) {
        return (
            <BlurView tint="dark" intensity={100} style={tw`flex-1 bg-gray-800/90 justify-center items-center pt-10`}>
                <View style={tw`p-2 bg-white/70 rounded-full`}>
                    <ActivityIndicator size="large" />
                </View>
            </BlurView>
        )
    } 
        
    return (
        <BlurView tint="dark" intensity={100} style={tw.style(`flex-1 bg-gray-800/90`, { paddingTop: headerHeight + 20 })}>
            <View style={tw`items-center gap-6 mx-4`}>
                <TouchableOpacity onPress={onCaptureImage} style={tw`p-2 bg-white/10 rounded-full`}>
                    <Image source={{uri: user.imageUrl}} style={tw`w-20 h-20 rounded-full`} />
                </TouchableOpacity>
                <View style={tw`flex-row items-center justify-end gap-3 max-h-10 mx-2 mb-3`}>
                    {edit ? (
                        <>
                            <TextInput
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                style={tw`px-3 py-2 bg-white flex-1 rounded-xl`}
                            />
                            <TextInput
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                                style={tw`px-3 py-2 bg-white flex-1 rounded-xl`}
                            />
                            <TouchableOpacity onPress={onSaveUser} style={tw`p-2 -ml-2`}>
                                <Ionicons name="checkmark" size={27} color="white" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={tw`text-white text-xl tracking-wide font-semibold`}>{user?.firstName ?? 'Anonymous'} {user?.lastName}</Text>
                            <TouchableOpacity onPress={() => setEdit(!edit)} style={tw`p-2 -ml-3 rounded-full`}>
                                <Ionicons name="ellipsis-vertical" size={23} color="white" />     
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <View style={tw`p-3 bg-white/10 w-full rounded-lg gap-2`}>
                    <TouchableOpacity onPress={() => signOut()} style={tw`flex-row items-center gap-x-4 min-h-11`}>
                        <Ionicons name="exit" size={26} color="white" />
                        <Text style={tw`text-white text-base`}>Log out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`flex-row items-center gap-x-4 min-h-11`}>
                        <Ionicons name="person" size={25} color="white" />
                        <Text style={tw`text-white text-base`}>Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`flex-row items-center gap-x-4 min-h-11`}>
                        <Ionicons name="bulb" size={26} color="white" />
                        <Text style={tw`text-white text-base`}>Learn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`flex-row justify-between items-center min-h-11`}>
                        <View style={tw`flex-row items-center gap-x-4`}>
                            <Ionicons name="megaphone" size={26} color="white" />
                            <Text style={tw`text-white text-base`}>Inbox</Text>
                        </View>
                        <View style={tw`bg-sky-800 px-1.5 py-1 justify-center items-center rounded-full`}>
                            <Text style={tw`text-white`}>14</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={tw`p-3 bg-white/10 w-full rounded-lg gap-2`}>
                    {ICONS.map(icon => (
                        <TouchableOpacity key={icon.name} onPress={() => setActiveIcon(icon.name)} style={tw`flex-row items-center gap-x-4 min-h-11`}>
                            <Image source={icon.icon} style={tw`w-6 h-6 rounded`} />
                            <Text style={tw`text-white text-base`}>{icon.name}</Text>
                            {activeIcon === icon.name && (
                                <Ionicons name='checkmark' size={26} color="white" style={tw`ml-auto`} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </BlurView>
    )
}