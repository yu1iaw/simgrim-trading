import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, SectionList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import tw from 'twrnc';
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";


const categories = ["Overview", "News", "Orders", "Transactions"];

export default function Cryptocurrency() {
    const [activeCategory, setActiveCategory] = useState(0);
    const { id } = useLocalSearchParams();
    const headerHeight = useHeaderHeight();
    const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });
    const font = useFont(require('@/assets/fonts/SpaceMono-Regular.ttf'), 11);


    useEffect(() => {
        if (isActive) Haptics.selectionAsync();

    }, [isActive])


    const { data, isPending } = useQuery({
        queryKey: ["info", id],
        queryFn: () => fetch(`/api/info?ids=${id}`)
            .then(res => res.json())
            .then(res => {
                return {
                    title: res[+id].name,
                    data: [res[+id]]
                };
            }),
        enabled: !!id
    });

    const { data: tickers } = useQuery({
        queryKey: ["tickers"],
        queryFn: (): Promise<any[]> => fetch('/api/tickers').then(res => res.json())
    })

    const animatedText = useAnimatedProps(() => {
        return {
            text: `${state.y.price.value.value}€`,
            defaultValue: '',
        };
    });

    const animatedDateText = useAnimatedProps(() => {
        const date = new Date(state.x.value.value);
        return {
            text: `${date.toLocaleDateString()}`,
            defaultValue: '',
        };
    });


    if (isPending) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" />
            </View>
        )
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: data?.title,
                }}
            />
            <SectionList
                contentInsetAdjustmentBehavior="automatic"
                style={{ marginTop: headerHeight }}
                keyExtractor={item => item.id}
                sections={data ? [data] : []}
                renderSectionHeader={({ section }) => (
                    <ScrollView
                        style={tw`h-15 border-b-[0.5px] border-gray-300`}
                        contentContainerStyle={tw`px-4 gap-x-4 items-center`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                onPress={() => setActiveCategory(index)}
                                key={category}
                                style={tw`min-w-22 h-9 px-2 justify-center items-center rounded-full ${activeCategory === index ? 'bg-white shadow-sm' : ''}`}
                            >
                                <Text style={tw`${activeCategory === index ? 'text-black font-medium' : 'text-gray-700'}`}>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
                ListHeaderComponent={() => (
                    <>
                        <View style={tw`flex-row items-center justify-between mx-4 my-2`}>
                            <Text style={tw`text-xl`}>{data?.data[0].symbol}</Text>
                            <Image source={{ uri: data?.data[0].logo }} style={tw`w-10 h-10 rounded-full`} />
                        </View>
                        <View style={tw`flex-row m-4 gap-4`}>
                            <TouchableOpacity
                                style={tw.style(`flex-row gap-4`, defaultStyles.pillButtonSmall, { backgroundColor: Colors.primary })}
                            >
                                <Ionicons name="add" size={24} color={'#fff'} />
                                <Text style={[defaultStyles.buttonText, { color: '#fff' }]}>Buy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={tw.style(`flex-row gap-4`, defaultStyles.pillButtonSmall, { backgroundColor: Colors.primaryMuted })}
                            >
                                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                                <Text style={[defaultStyles.buttonText, { color: Colors.primary }]}>Receive</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                renderItem={({ item }) => (
                    <>
                        {tickers && (
                            <View style={tw.style(`h-[500px] mt-4`, defaultStyles.block)}>
                                {!isActive ? (
                                    <View>
                                        <Text style={tw`font-bold text-sm tracking-wide`}>{tickers.at(-1).price}€</Text>
                                        <Text style={tw`text-xs`}>Today</Text>
                                    </View>
                                ) : (
                                    <View>
                                        <AnimatedTextInput
                                            editable={false}
                                            underlineColorAndroid="transparent"
                                            style={tw`font-bold text-sm tracking-wide`}
                                            animatedProps={animatedText}
                                        />
                                        <AnimatedTextInput
                                            editable={false}
                                            underlineColorAndroid="transparent"
                                            style={tw`text-xs`}
                                            animatedProps={animatedDateText}
                                        />
                                    </View>
                                )}
                                <CartesianChart
                                    chartPressState={state}
                                    data={tickers}
                                    xKey="timestamp"
                                    yKeys={["price"]}
                                    axisOptions={{
                                        font,
                                        tickCount: 5,
                                        labelOffset: { x: -2, y: 4 },
                                        labelColor: Colors.gray,
                                        formatYLabel: (v) => `€${v}`,
                                        formatXLabel: (ms) => format(new Date(ms), 'dd/M')
                                    }}
                                >
                                    {({ points }) => (
                                        <>
                                            <Line points={points.price} color={Colors.primary} strokeWidth={3} />
                                            {isActive && <ToolTip x={state.x.position} y={state.y.price.position} />}
                                        </>
                                    )}
                                </CartesianChart>
                            </View>
                        )}
                        <View style={tw.style(`mt-5`, defaultStyles.block)}>
                            <Text style={tw`text-base font-bold`}>Overview</Text>
                            <Text style={tw`text-gray-700`}>{item.description}</Text>
                            <Text>{JSON.stringify(item, null, 4)}</Text>
                        </View>
                    </>
                )}
            />

        </>
    )
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
    return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);