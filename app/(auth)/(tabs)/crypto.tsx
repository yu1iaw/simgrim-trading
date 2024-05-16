import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import tw from 'twrnc';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from "@expo/vector-icons";
import { Currency } from "@/interface";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";



export default function Crypto() {
    const headerHeight = useHeaderHeight();

    const currencies = useQuery({
        queryKey: ['listing'],
        queryFn: () => fetch('/api/listing').then(res => res.json())
    })

    const ids = currencies.data?.map((currency: Currency) => currency.id).join(',');

    const { data, isPending } = useQuery({
        queryKey: ['info', ids],
        queryFn: () => fetch(`/api/info?ids=${ids}`).then(res => res.json()),
        enabled: !!ids,
    })


    if (isPending) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" />
            </View>
        )
    };

    return (
        <ScrollView
            style={{ backgroundColor: Colors.background }}
            contentContainerStyle={{ paddingTop: headerHeight }}
            showsVerticalScrollIndicator={false}
        >
            <Text style={defaultStyles.sectionHeader}>Transactions</Text>
            <View style={defaultStyles.block}>
                {currencies.data?.map((currency: Currency) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/crypto/${currency.id}`)}
                        key={currency.id}
                        activeOpacity={0.7}
                        style={tw`flex-row items-center py-1 gap-5`}
                    >
                        <Image source={{ uri: data[currency.id].logo }} style={tw`w-12 h-12 rounded-full`} />
                        <View style={tw`flex-1 gap-y-2`}>
                            <Text style={tw`font-semibold`}>{currency.name}</Text>
                            <Text style={tw`text-gray-500`}>{currency.symbol}</Text>
                        </View>
                        <View style={tw`w-1/3 gap-y-2`}>
                            <Text style={tw`self-end`}>{currency.quote?.EUR.price.toFixed(3)}€</Text>
                            <View style={tw`flex-row items-center gap-x-[6px]`}>
                                <Ionicons
                                    name={currency.quote.EUR.percent_change_1h > 0 ? "caret-up" : "caret-down"}
                                    size={16}
                                    color={currency.quote.EUR.percent_change_1h > 0 ? 'green' : 'red'}
                                />
                                <Text style={tw`${currency.quote.EUR.percent_change_1h > 0 ? 'text-teal-600' : 'text-rose-600'}`}>{currency.quote.EUR.percent_change_1h.toFixed(5)}%</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}