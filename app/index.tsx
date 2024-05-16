import { useAssets } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';



export default function Screen() {
  const [assets] = useAssets([require('@/assets/video/intro.mp4')]);

  return (
    <View style={tw`flex-1 justify-between`}>
      <StatusBar style="auto" />
      {assets && (
        <Video
          source={{ uri: assets[0].uri }}
          isLooping={false}
          isMuted
          shouldPlay
          resizeMode={ResizeMode.COVER}
          style={tw`absolute w-full h-full`}
        />
      )}
      <View style={tw`mt-14 p-5`}>
        <Text style={tw`font-black text-3xl text-white uppercase`}>Ready to change the way you money?</Text>
      </View>
      <View style={tw`flex-row justify-center gap-5 p-5 mb-10`}>
        <Link href='/login' asChild style={[defaultStyles.pillButton, {flex: 1, backgroundColor: Colors.dark}]}>
          <TouchableOpacity>
            <Text style={tw`text-white text-xl font-medium`}>Log in</Text>
          </TouchableOpacity>
        </Link>
        <Link href='/register' asChild style={[defaultStyles.pillButton, {flex: 1, backgroundColor: '#fff'}]}>
          <TouchableOpacity>
            <Text style={tw`text-xl font-medium`}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

