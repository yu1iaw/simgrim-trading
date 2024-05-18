import { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, SectionList, Text, TouchableOpacity, View } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import tw from 'twrnc';
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Chart from "@/components/CartesianChart";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";


const categories = ["Overview", "News", "Orders", "Transactions"];

export default function Cryptocurrency() {
    const [activeCategory, setActiveCategory] = useState(0);
    const { id } = useLocalSearchParams();
    const headerHeight = useHeaderHeight();

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
                        <Chart />
                        <View style={tw.style(`my-5`, defaultStyles.block)}>
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

