
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import SearchPreview from "../Preview/SearchPreview";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native";
import { VStack, Input, Icon, NativeBaseProvider, Box } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import useDebounce from "../utils/SearchUtility";

var {width} = Dimensions.get("screen");

const SearchData = () =>{

    const [result, setResult] = useState([]);
    const [search, setSearch] = useState(null); 
    const [loading, setLoading] = useState(false);
    const debounceSearch = useDebounce(search, 300);

    useEffect(()=>{
        async function fetchData(){
                setLoading(true);
                setResult([]);
                const data = await fetch(`https://api.consumet.org/anime/gogoanime/${debounceSearch}?page={number}`)
                .then(res => res.json());
                setResult(data.results);
                setLoading(false)
        }
        if(debounceSearch)fetchData()
    },[debounceSearch])

    const getSearchAnime = () =>{
       
        if(loading){
            return<View>
                  <ActivityIndicator size={"large"} color={"#00ff00"} />
            </View>
        }
        return(
            <View>
                <FlatList 
                    numColumns={3}
                    data={result}
                    renderItem={({item})=>
                    <SearchPreview 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    picture={item.image}
                    date={item.releaseDate}
                    type={item.subOrDub}
                    link={item.url}
                    /> 
                }
                />
            </View>
        )
    }

    return (
        <NativeBaseProvider>
            <Box style={{marginBottom: 70}}>
                <View style={styles.container}>
                    <VStack style={{marginBottom: 15}}>
                        <Input 
                            color="white"
                            width={width}
                            placeholder="Search the title of the Anime" 
                            borderRadius="4" 
                            py="3" px="1" fontSize="14" 
                            InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />}
                            onChangeText={(text) =>setSearch(text)}
                            value={search}
                            autoFocus
                        /> 
                    </VStack>
                    {getSearchAnime()}
                    <SearchPreview /> 
                </View>
            </Box>
        </NativeBaseProvider>
    )
}
const styles = StyleSheet.create({

    container:{
        flex: 1,
        marginTop: 20,
        alignItems:"center",
    }, 
   

})

export default SearchData;