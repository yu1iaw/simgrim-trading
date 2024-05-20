import { forwardRef, memo, useCallback, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AnchorProvider, ScrollTo, ScrollView, Target, useAnchors, useRegisterScroller, useRegisterTarget, useScrollTo } from '@nandorojo/anchor';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';



type CategoryProps = {
    category: string;
    onPress?: (category: string) => void;
};
const categories = ["Overview", "News", "Orders", "Transactions", "Signals"];


export default function Invest() {
    const [top, setTop] = useState(0);
    const anchors = useAnchors();
    

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = e.nativeEvent.contentOffset;
        if (y < 500) setTop(0);
    }

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = e.nativeEvent.contentOffset;
        if (y > 500) setTop(y);
    }

    
    const onCategoryBtnPress = useCallback((category: string) => {
        anchors.current?.scrollTo(category);
    }, [])


    return (
        <ScrollView 
            onScrollBeginDrag={() => setTop(0)}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScroll={onScroll}
            contentContainerStyle={tw`pb-12`} 
            showsVerticalScrollIndicator={false}
            anchors={anchors}
        >
            <Target name="top">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={tw`flex-row justify-around py-4 px-3 gap-3`}>
                        {categories.map((category, index) => (
                            <CategoryBtn onPress={onCategoryBtnPress} category={category} key={category} />
                        ))}
                    </View>
                </ScrollView>
            </Target>
            <View style={tw`h-160 bg-sky-800`} />
            <View style={tw`h-160 bg-yellow-500`} />
      
            {categories.map(category => (
                <CategoryItem category={category} key={category} />
            ))}
            
            {!!top && (
                <ScrollTo target="top" style={tw`absolute top-[${top+550}px] right-3`}>
                    <Animated.View entering={FadeIn.delay(500)}>
                        <Ionicons name="caret-up" size={30} color="white" style={tw`bg-gray-400/50 p-1 rounded-full`} />
                    </Animated.View>
                </ScrollTo>
            )} 
        </ScrollView>
    )
}


const CategoryBtn = memo(({ category, onPress }: CategoryProps) => (
    // <ScrollTo target={category} style={tw`p-2 bg-white rounded-lg shadow-sm`}>
    <View style={tw`p-2 bg-white rounded-lg shadow-sm`}>
        <Text onPress={() => onPress!(category)} style={tw`text-black font-medium`}>{category}</Text>
    </View>
    // </ScrollTo>
))

const CategoryItem = memo(({ category }: CategoryProps) => (
    <Target name={category}>
        <ScrollTo target="top">
            <View style={tw.style(`my-5`, defaultStyles.block)}>
                <Text style={tw`text-base font-bold`}>{category}</Text>
                <Text style={tw`text-gray-700`}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores quisquam deserunt quas ducimus voluptatibus ipsum assumenda suscipit voluptas minus similique, iure voluptatum nostrum iste explicabo possimus? Id, nemo magni, laboriosam sunt nulla itaque quasi dolorem eaque soluta reiciendis nam! Itaque fugiat reiciendis iusto, explicabo, debitis ipsam doloremque iste quod soluta eaque minima voluptatibus quidem dicta nemo ut reprehenderit tempora. Dicta tempora provident animi repudiandae voluptates? Reprehenderit veniam qui labore harum delectus culpa, officia repellendus, architecto quidem debitis, tempora sapiente omnis magnam odio porro exercitationem? Nesciunt praesentium non laborum accusantium adipisci ex iure explicabo voluptates? Ea, eaque natus! Similique velit minima tenetur! Culpa eum illo sint delectus blanditiis. Commodi distinctio nobis ut temporibus, aliquid aliquam, velit quibusdam officiis, corporis nam fugit quam blanditiis eum vitae exercitationem eligendi saepe sit corrupti laboriosam?</Text>
            </View>
        </ScrollTo>
    </Target> 

))