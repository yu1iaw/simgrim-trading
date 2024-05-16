import { Tabs } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import Colors from "@/constants/Colors";
import { CustomHeader } from "@/components/CustomHeader";


export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarBackground: () => (
                    <BlurView tint="light" intensity={100} style={tw`flex-1 bg-white/70`} />
                ),
                tabBarStyle: {
                    backgroundColor: "transparent",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTopWidth: 0,
                    elevation: 0
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerTitleAlign: "center",
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="registered" size={size} color={color} />
                    ),
                    header: () => <CustomHeader />,
                    headerTransparent: true
                }}
            />
            <Tabs.Screen
                name="invest"
                options={{
                    title: "Invest",
                    headerTitleAlign: "center",
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="line-chart" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="transfers"
                options={{
                    title: "Transfers",
                    headerTitleAlign: "center",
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="exchange" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="crypto"
                options={{
                    title: "Crypto",
                    headerTitleAlign: "center",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="bitcoin" size={size} color={color} />
                    ),
                    header: () => <CustomHeader />,
                    headerTransparent: true
                }}
            />
            <Tabs.Screen
                name="lifestyle"
                options={{
                    title: "Lifestyle",
                    headerTitleAlign: "center",
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="th" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    )
}

