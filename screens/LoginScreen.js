import { View, Text, TouchableOpacity, TextInput, Image ,SafeAreaView , Alert} from 'react-native'
import React  ,{useState} from 'react'
import {ArrowLeftIcon} from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import Colors from '../constants/Colors';
import { useLanguage } from '../LanguageProvider';
import { userLogin } from '../redux/user';

import { useDispatch , useSelector } from 'react-redux';



export default function LoginScreen() {
    const navigation = useNavigation();
    const { translate } = useLanguage();
    const [email , setEmail] = useState("") 
    const [password , setPassword] = useState("") 

    const dispatch = useDispatch();

    const handleLogin = () =>{
  
  
      console.log(email, password);
      // setLoading(true)
      const data = {
        email: email,
        password: password,
      };
    
      dispatch(userLogin(data))
      .then((res) => {
        // setLoading(false);
        if (res.error) {
          Alert.alert('Wrong email and Password')
        } else {
          console.log(res)
          navigation.navigate('Tabs')
        }
      })
      .catch((error) => {
        Alert.alert('Network error')
        // setLoading(false)
        console.error("Failed to login", error);
      });
    }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <TouchableOpacity
          style={{ backgroundColor: '#FBBF24', padding: 10, borderTopRightRadius: 16, borderBottomLeftRadius: 16, marginLeft: 16 , marginTop:20 }}
        >
          <ArrowLeftIcon size={20} color='black' />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Image source={require('../assets/update.jpg')} style={{ width: 200, height: 200 }} />
      </View>
    </SafeAreaView>
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 32, paddingTop: 32, borderTopLeftRadius: 50, borderTopRightRadius: 50 , marginTop:'-40%' }}>
      <View style={{ marginBottom: 1 }}>
        <Text style={{ color: '#4B5563', marginLeft: 16 }}>{translate('email address')}</Text>
        <TextInput
          style={{ padding: 16, backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 16, marginBottom: 12 }}
          // value='email@tripways.com'
          placeholder='Enter Email'
          onChangeText={setEmail}

        />
        <Text style={{ color: '#4B5563', marginLeft: 16 }}>{translate('password')}</Text>
        <TextInput
          style={{ padding: 16, backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 16, marginBottom: 12 }}
          secureTextEntry
          // value='test12345'
          placeholder='Enter Password'
          onChangeText={setPassword}

        />
        <TouchableOpacity style={{ alignItems: 'flex-end', marginBottom: 20 }}>
          <Text style={{ color: '#4B5563' }}>{translate('forgot password')}</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => handleLogin()}  style={{ paddingVertical: 12, backgroundColor: '#FBBF24', borderRadius: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#4B5563' , marginLeft:50 }}>
          {translate('login')}          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 20, color: '#4B5563', fontWeight: 'bold', textAlign: 'center', paddingVertical: 20 }}>
      {translate('or')}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity>
          <Image source={require('../assets/google.png')} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
        <Text style={{ color: '#6B7280', fontWeight: '600' }}> {translate('Dont have an account')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{ fontWeight: '600', color: '#FBBF24' }}>{translate('sign up')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  
  )
}