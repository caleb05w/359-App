import {useState, useEffect} from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import { saveUserPrefs, loadUserPrefs, removeUserPrefs } from '../utils/storage';

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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const colors = ["red", "blue", "orange", "green"];
    const [selectedColor, setSelectedColor] = useState("")


    const handleAddItem = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Please enter both username and password.");
      return;
    }
    setList([{ name: username }, ...list]);
    setUsername("");
    setPassword("");
  };

  //pass values onto next page
  //also load it into our asycn storage 
    const changePage = async () => {

        //save user prefs
        await saveUserPrefs(item, selectedColor);

        navigation.navigate("Test", {item:item.trim(), color:selectedColor})
    }

    useEffect(()=>{
        console.log(loadUserPrefs);
        
        (async () => {
        const load = await loadUserPrefs();
        if (load?.item) setItem(load.item);
        if (load?.selectedColor) setSelectedColor(load.selectedColor);
        }
    )
    }, []);

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


            <View style={styles.colorsRow}> 
            {colors.map((item)=>(
                <TouchableOpacity
                onPress={()=>setSelectedColor(item)}
                key={item}
                style={[styles.colorsSwatch, {backgroundColor:item, borderWidth: selectedColor === item ? 3 : 1}]}>
                <Text>{item}</Text>
                </TouchableOpacity>
            ))
             }
             </View>
            

            <View style={[styles.containerFlexRow]}>
                <Button
                title="add items"
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
               changePage()
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
    flexDirection: "column",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

        
    colorsRow: {
        flexDirection: "row",
        gap: 12,
        marginVertical: 10,
    },

    colorsSwatch: {
        width: "fit-content",
        height: "fit-content",
        padding: 12,
        borderColor: "#111",
        borderRadius: 8,
    },
});