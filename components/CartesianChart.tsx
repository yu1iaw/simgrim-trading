import { useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import { format } from 'date-fns';
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import * as Haptics from 'expo-haptics';
import { defaultStyles } from "@/constants/Styles";
import { useQuery } from '@tanstack/react-query';
import Colors from '@/constants/Colors';



export default function Chart() {
    const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });
    const font = useFont(require('@/assets/fonts/SpaceMono-Regular.ttf'), 11);
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



    useEffect(() => {
        if (isActive) Haptics.selectionAsync();

    }, [isActive])


    return (
        tickers && (
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
        )

    )
}

const ToolTip = ({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) => {
    return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);