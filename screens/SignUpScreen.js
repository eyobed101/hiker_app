import { View, Text, TouchableOpacity, TextInput,Image ,Alert } from 'react-native'
import React ,{useState} from 'react'
import {ArrowLeftIcon} from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { emailLogin } from '../redux/user';
import { useLanguage } from '../LanguageProvider';
import { useDispatch , useSelector } from 'react-redux';


export default function SignUpScreen() {
   
  const [username , setUsername] = useState("") 
  const [email , setEmail] = useState("") 
  const [password , setPassword] = useState("") 


  const { translate } = useLanguage();

    const navigation = useNavigation();
    // const current = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
     

const handleSignUp = () =>{
  
  
  console.log(email, password);
  // setLoading(true)
  const data = {
    username: username,
    email: email,
    password: password,
  };
  
  console.log("best" , data)
  dispatch(emailLogin(data))
  .then((res) => {
    // setLoading(false);
    if (res.error) {
      Alert.alert('Not registered')
      console.log(res)
    } else {
      console.log(res)
      Alert.alert("User is Registered")
    }
  })
  .catch((error) => {
    Alert.alert('Network error')
    // setLoading(false)
    console.error("Failed to login", error);
  });
}

  return (
    <View style={{ flex: 1, backgroundColor: '#4279A6' }}>
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <TouchableOpacity
          style={{ backgroundColor: '#FBBF24', padding: 8, borderTopRightRadius: 16, borderBottomLeftRadius: 16, marginLeft: 16 , marginTop:20 }}
        >
          <ArrowLeftIcon size={20} color='black' />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Image source={require('../assets/update.jpg')} style={{ width: 200, height: 200 }} />
      </View>
    </SafeAreaView>
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 32, paddingTop: 32, borderTopLeftRadius: 50, borderTopRightRadius: 50 , marginTop:'-50%' }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: '#4B5563', marginLeft: 16 }}>{translate('full name')}</Text>
        <TextInput
          style={{ padding: 16, backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 16, marginBottom: 18 }}
          // value='email@tripways.com'
          placeholder='Enter Name'
          onChangeText={setUsername}

        />
        <Text style={{ color: '#4B5563', marginLeft: 16 }}>{translate('email address')}</Text>
        <TextInput
          style={{ padding: 16, backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 16, marginBottom: 18 }}
          // value='email@tripways.com'
          placeholder='Enter Email'
          onChangeText={setEmail}

        />
        <Text style={{ color: '#4B5563', marginLeft: 16 }}>{translate('password')}</Text>
        <TextInput
          style={{ padding: 16, backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 16, marginBottom: 18 }}
          secureTextEntry
          // value='test12345'
          placeholder='Enter Password'
          onChangeText={setPassword}

        />
        <TouchableOpacity style={{ paddingVertical: 12, backgroundColor: '#FBBF24', borderRadius: 12 }}
             onPress={() => handleSignUp()}
             >
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#4B5563' }}>
          {translate('sign up')}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 14, color: '#4B5563', fontWeight: 'bold', textAlign: 'center', paddingVertical: 20 }}>
      {translate('or')} 
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity>
          <Image source={require('../assets/google.png')} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
        <Text style={{ color: '#6B7280', fontWeight: '600' }}> {translate('already have an account')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ fontWeight: '600', color: '#FBBF24' }}>  {translate('login')} </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  
  )
}