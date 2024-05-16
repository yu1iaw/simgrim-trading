import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';



type RoundedButtonProps = {
    text: string;
    icon: typeof Ionicons.defaultProps;
    onPress?: () => void;
}

export const RoundedButton = ({ text, icon, onPress }: RoundedButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={tw`items-center gap-3`}>
            <View style={tw`w-14 h-14 justify-center items-center rounded-full bg-gray-300`}>
                <Ionicons name={icon} size={30} color={Colors.dark} />
            </View>
            <Text style={tw`font-semibold text-[12px] text-gray-700`}>{text}</Text>
        </TouchableOpacity>
    )
}