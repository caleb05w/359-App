import { Text, View, StyleSheet} from 'react-native'

export default function TestScreen({navigation, route}) {
    console.log(route.params);
    const initialItem = route?.params?.item?? null;
    const bg = route?.params.color?? null;


    return (
    <View>
        <Text>My Aquarium</Text>
        <View style={styles.flex}>
        <View style={[styles.colorBox, {backgroundColor: bg?? black}]}></View>
        <Text> {initialItem ?? " no item" } </Text>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    colorBox: {
        height: 40,
        width: 40,
        borderColor: "#111",
        borderRadius: 8,
        backgroundColor: "red",
    },

    flex: {
        display: "flex",
        flexDirection: "row",
        gap: 4,
    },
})


