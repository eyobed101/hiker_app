// import { View, Text, FlatList , ScrollView } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import Category from './category'
// import Card from './Card'
// import { adData } from '../data/ad'

// export default function ListCategory() {

//   useEffect(() =>{
//     GetHike('Beaches')
//   },[])  

//   const [dataList , setDataList] = useState([])  
//   const GetHike =(category) =>{
//     setDataList([]);
//       setDataList(adData.filter(item => item.category === category))
//       console.log(category)
//   }

//   return (
// //     <FlatList
// //     data={[]} // Since we're not rendering list items in the FlatList itself
// //     ListHeaderComponent={(
// //       <View >
// //         <Category  category={(value) => GetHike(value)}/> 
// //         <Card dataList={dataList}/>
// //       </View>
// //     )}
// //     keyExtractor={(item, index) => index.toString()}
// //   />
//     <View >
//         <Category  category={(value) => GetHike(value)}/>   
//          <Card dataList={dataList}/>
//     </View>
//   )
// }