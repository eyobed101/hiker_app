import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React ,{useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useLanguage } from '../LanguageProvider'
import { useDispatch, useSelector } from "react-redux";


export default function WelcomeScreen() {
  const { translate } = useLanguage();
    const navigation = useNavigation()
    const current = useSelector((state) => state.user.value);
    



    useEffect(() => {
      if (current) {
        navigation.navigate("Tabs");
        console.log("test" , current )
      }
    }, [current]);

    
    
  return (
    <SafeAreaView className="flex-1" style={{backgroundColor: '#4279A6' , flex:1}}>
    <View style={{ flex: 1, justifyContent: 'space-around', marginVertical: 16 }}>
  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 32, textAlign: 'center' }}>
  {translate('lets get started')}
  </Text>
  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
    <Image source={require('../assets/trekking-hiking-FB.jpg')} style={{ width: 300, height: 300 , borderRadius:20 }} />
  </View>
  <View style={{ marginVertical: 16 }}>
    <TouchableOpacity
      style={{ paddingVertical: 12, backgroundColor: '#FBBF24', marginHorizontal: 28, borderRadius: 12 }}
      onPress={() => navigation.navigate('SignUp')}
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#4B5563' }}>
      {translate('sign up')}  
      </Text>
    </TouchableOpacity>
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
      <Text style={{ color: 'white', fontWeight: '600' }}>{translate('already have an account')}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ fontWeight: '600', color: '#FBBF24' }}> {translate('login')}</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>
    </SafeAreaView>
  )
}