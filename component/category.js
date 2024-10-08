import { View, Text , FlatList, TouchableOpacity ,StyleSheet } from 'react-native'
import React, { useState ,useEffect } from 'react'
import { adData } from '../data/ad'
import Colors from '../constants/Colors'
import { useLanguage } from '../LanguageProvider'
import axiosInstance from '../config/axios'


export default function Category({category}) {

  const { translate } = useLanguage();
  const [categories , setCategory] = useState([]);

  const fetchData = async () => {
    try {
  
      const response = await axiosInstance.get('/category');
      const data = response.data
      return data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return [];
    }
  };


  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const fetchedData = await fetchData();
      setCategory(fetchedData);
      console.log("was ", categories)
    };
    fetchDataAndSetState();
  }, []);

  
  // const uniqueCategories = Array.from(new Set(adData.map(item => item.category)))
  //   .map(category => {
  //     return adData.find(item => item.category === category); // get the first matching item for each unique category
  //   });


   const [selectedCategory , setSelectedCategory] = useState('Beaches') 

  return (
    <View style={{
        marginTop:20,
    }}>
      <Text style={{
        fontSize:18,
        //  marginBottom:-10
      }}>{translate('category')}</Text>
      <FlatList 
      data={categories}
      numColumns={4}
      renderItem={({item}) => {
        return(
          <TouchableOpacity 
          onPress={() =>{
            setSelectedCategory(item.name);
            category(item.name)
          } 
          }
          style={{
            flex:1
            // marginBottom:20
          }}>
            <View style={[styles.container , selectedCategory == item.name&& styles.selectedCategory]}>
              <Text style={[{fontSize:13 , color:'black' }, selectedCategory == item.name&& {color : Colors.white} ]}>{translate(item.name)}</Text>
              </View>
            </TouchableOpacity>
        )
      }}
      keyExtractor={(item, index) => index.toString()}  // Add a keyExtractor
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container :{
     backgroundColor :Colors.bgColor ,
     padding:10 ,
     alignItems : 'center',
     borderWidth : 1 ,
     borderRadius:15 ,
     borderColor : Colors.black,
     margin:2
  } ,
   selectedCategory :{
    backgroundColor: Colors.primaryColor,
    borderColor :Colors.white ,
   }
})