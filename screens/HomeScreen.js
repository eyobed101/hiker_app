import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React ,{useEffect , useState} from 'react'
import Header from '../component/header'
import Slider from '../component/slider'
import Category from '../component/category'
import Card from '../component/Card'
import { adData } from '../data/ad'
import { useNavigation } from '@react-navigation/native'
import { useLanguage } from '../LanguageProvider'
import { useSelector } from 'react-redux'
import axiosInstance from '../config/axios'



export default function HomeScreen() {

  const [languageVal, setLanguageVal] = useState('en')
  const { language, toggleLanguage, translate } = useLanguage();
  const current = useSelector((state) => state.user);
  const [dataSource , setDataSource] = useState([]);


  const navigation = useNavigation();
  useEffect(() =>{
    GetHike('Beaches')
    console.log("wos ",current.username)
  },[current , dataSource])  

  const fetchData = async () => {
    try {
  
      const response = await axiosInstance.get('/event/all');
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
      setDataSource(fetchedData);
    
    };
    fetchDataAndSetState();
  }, []);

  

  const [dataList , setDataList] = useState([])  
  
  useEffect(() =>{
 GetHike()
}, [dataSource])

  const GetHike =(category) =>{
    setDataList([]);
    console.log("cate" ,dataSource?.filter(item => item?.categories.name == "Beaches"))
      setDataList(dataSource.filter(item => item?.categories.name === category))
      console.log(category)
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Non-scrollable Content */}
      <View style={styles.nonScrollableContent}>
        <Header />
        <Slider />
        <View style={styles.categoryContainer}>
          <Category category={(value) => GetHike(value)} />
        </View>
      </View>
  
      {/* Scrollable Card Content */}
      <ScrollView style={styles.scrollableContainer} contentContainerStyle={styles.cardContent}>
        <Card dataList={dataList} navigation={navigation} />
      </ScrollView>
    </View>
  );
}
  const styles = StyleSheet.create({
    // Non-scrollable section, larger
    nonScrollableContent: {
      padding: 20,
      marginBottom: "30%",
      // Adjust height to ensure visibility of the Category component
      flex: 0.9, // Adjust this to balance the space for non-scrollable section
    },
  
    // Explicit height for Category to ensure it’s visible
    categoryContainer: {
      marginTop: 10,
      height: 100,  // Adjust as necessary to ensure visibility of Category
    },
    
    // Scrollable card section with smaller size
    scrollableContainer: {
      flex: 1,
      marginTop: 20,
    },
    cardContent: {
      padding: 10, // Reduced padding to make items smaller
    },
  });
  