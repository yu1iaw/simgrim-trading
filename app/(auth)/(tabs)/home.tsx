import { ScrollView, Text, View } from "react-native";
import tw from 'twrnc';
import Colors from "@/constants/Colors";
import { RoundedButton } from "@/components/RoundedButton";
import { Dropdown } from "@/components/DropdownMenu";
import { useBalanceStore } from "@/store/balanceStore";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from '@react-navigation/elements';
import WidgetList from "@/components/SortableList/WidgetList";



export default function Home() {
    const { balance, transactions, runTransaction, clearTransactions } = useBalanceStore();
    const headerHeight = useHeaderHeight();

    const onAddMoney = () => {
        runTransaction({
            id: Math.random().toString(),
            title: "Added money",
            date: new Date(),
            amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1)
        })
    }

    return (
        <ScrollView
            style={{ backgroundColor: Colors.background }}
            contentContainerStyle={{ paddingTop: headerHeight }}
            showsVerticalScrollIndicator={false}
        >
            <View style={tw`m-16 items-center`}>
                <View style={tw`flex-row items-baseline gap-x-3`}>
                    <Text style={tw`text-6xl font-bold`}>{balance()}</Text>
                    <Text style={tw`text-3xl font-semibold`}>€</Text>
                </View>
            </View>
            <View style={tw`flex-row justify-between mx-5 mb-5`}>
                <RoundedButton icon="add" text="Add money" onPress={onAddMoney} />
                <RoundedButton icon="refresh" text="Exchange" onPress={clearTransactions}  />
                <RoundedButton icon="list" text="Details"  />
                <Dropdown />
            </View>
            <Text style={defaultStyles.sectionHeader}>Transactions</Text>
            <ScrollView
                style={tw`max-h-[260px]`}
                nestedScrollEnabled={true}
                contentContainerStyle={tw`mx-5 p-4 bg-white gap-5 rounded-lg mb-8`}
                showsVerticalScrollIndicator={false}
            >
                {!!!transactions.length ? (
                    <Text style={tw`text-center text-gray-600 font-semibold`}>No transactions yet</Text>
                ) : (
                        transactions.map(transaction => (
                            <View key={transaction.id} style={tw`flex-row items-center gap-5`}>
                                <View style={tw`w-8 h-8 items-center justify-center bg-gray-300 rounded-full`}>
                                    <Ionicons name={transaction.amount > 0 ? 'add' : 'remove'} size={24} color={Colors.dark} />
                                </View>
                                <View style={tw`flex-1 gap-y-1`}>
                                    <Text style={tw`font-medium`}>{transaction.title}</Text>
                                    <Text style={tw`text-xs text-gray-400`}>{transaction.date.toLocaleString()}</Text>
                                </View>
                                <Text style={tw`self-start font-semibold`}>{transaction.amount}€</Text>
                            </View>
                    ))
                )}
            </ScrollView>
            <Text style={defaultStyles.sectionHeader}>Widgets</Text>
            <WidgetList />
        </ScrollView>
    )
}