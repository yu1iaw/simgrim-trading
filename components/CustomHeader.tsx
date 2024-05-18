import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useUser } from '@clerk/clerk-expo';
import Colors from '@/constants/Colors';



export const CustomHeader = () => {
    const { top } = useSafeAreaInsets();
    const { user } = useUser();

    return (
        <BlurView tint="extraLight" intensity={80} style={tw.style(`bg-white/70`, { paddingVertical: top + 10 })}>
            <View
                style={tw.style(`bg-transparent h-[60px] flex-row items-center px-3 gap-x-3`)}
            >
                <TouchableOpacity onPress={() => router.push('/(auth)/(modals)/profile')} style={tw`bg-gray-500 w-10 h-10 justify-center items-center rounded-full overflow-hidden`}>
                    {user ? (
                        <Image source={{ uri: user.imageUrl }} style={tw`w-full h-full`} />
                    ) : (
                        <Text style={tw`text-white font-semibold`}>AC</Text>
                    )}
                </TouchableOpacity>
                <View style={tw`flex-1`}>
                    <TextInput
                        style={tw`p-3 bg-gray-200 pl-11 text-base rounded-full`}
                        placeholder='Search'
                    />
                    <Ionicons style={tw`absolute top-4 left-3`} name="search" size={20} color={Colors.dark} />
                </View>
                <TouchableOpacity style={tw`bg-gray-300 w-10 h-10 justify-center items-center rounded-full`}>
                    <Ionicons name="stats-chart" size={20} color={Colors.dark} />
                </TouchableOpacity>
                <TouchableOpacity style={tw`bg-gray-300 w-10 h-10 justify-center items-center rounded-full`}>
                    <Ionicons name="card" size={20} color={Colors.dark} />
                </TouchableOpacity>
            </View>
        </BlurView>
    )
}