import {useState, useEffect} from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native'


//things to add 

//navigation
// Listing mechanism
// Storage mechanism
// logger
// Storage
// key system

export default function HomeScreen({navigation}) {

    const [list, setList] = useState([{name:"role"}, {name:"two"}]);
    const [item, setItem] = useState("");

 return (
    <View>
      <View style={[styles.containerFlex, styles.containerCenter]}>
        {list.map((temp) => (
          <Text key={temp.name}>{temp.name}</Text>
        ))}

            <TextInput
            styles={styles.h1}
            placeholder="enter name"
            value={item}
            onChangeText={setItem}
            />
            

            <View style={[styles.containerFlexRow]}>
                <Button
                title="add item"
                onPress={()=>{
                    setList([{name:item}, ...list])
                }}
                ></Button>
                <Button
                title="reset list"
                onPress={()=>{setList([])}}>
                </Button>
            </View>

            <Button
            title="Change page"
            onPress={()=>{
                navigation.navigate("Test")
            }}
            ></Button>
        </View>
        </View>
    )

}

const styles = StyleSheet.create({
  containerFlex: {
    flexDirection: "column",
    gap: 12,
    marginVertical: 10,
    width: "100%",
  },

  h1: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: "80%",
    borderRadius: 6,
  },

  containerFlexRow: {
    flexDirection: "row",
    gap: 12,
  },

    containerCenter: {
        flexDirection: "Row",
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",

    },
}
)