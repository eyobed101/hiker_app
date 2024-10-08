import { View, Text  , Image} from 'react-native'
import React from 'react'
import { useLanguage } from '../LanguageProvider'
import { useSelector } from 'react-redux';

export default function Header() {
  const { translate } = useLanguage();
  const current = useSelector((state) => state.user);

  return (
    <View style={{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',marginTop:30 , marginBottom:20
    }}>
        <View style={{ flexDirection:'row'}}>
            <Text style={{ fontSize:25 , color:'black' , marginRight:10}}>
            {translate('welcome')} 
            </Text>
            <Text style={{fontSize:25 , color:'black'}}>
             {current?.username}
            </Text>
        </View>
        <Image
       style={{width:40 , height:40 , borderRadius: 99 }}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
        {/* <Image source ={{uri:"https://tripways.vercel.app/img/trip.jpg"}} style={{width:40 , height:40 , borderRadius: 99 }} /> */}
    </View>
  )
}