import { View, Text, TouchableOpacity, TextInput, Image, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { useLanguage } from '../LanguageProvider';
import { ChatState } from '../Context/ChatProvider';
import { useDispatch } from 'react-redux';
import { userLogin } from '../redux/user';
import Toast from 'react-native-toast-message'; // Using react-native-toast-message for toast functionality

export default function LoginScreen() {
  const navigation = useNavigation();
  const { translate } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState(); // Accessing setUser from ChatState context
  const dispatch = useDispatch();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: translate('Error'),
        text2: translate('Please fill all the fields'),
        visibilityTime: 4000,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    const data = { email, password };

    try {
      const res = await dispatch(userLogin(data));

      if (res.error) {
        Toast.show({
          type: 'error',
          text1: translate('Login Failed'),
          text2: translate('Wrong email or password'),
          visibilityTime: 4000,
          position: 'bottom',
        });
      } else {
        setUser(res.payload);
        console.log("This is User Data", res);
        Toast.show({
          type: 'success',
          text1: translate('Login Successful'),
          text2: translate('You have successfully logged in!'),
          visibilityTime: 4000,
          position: 'bottom',
        });
        navigation.navigate('Tabs');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: translate('Network Error'),
        text2: translate('Failed to log in, please try again'),
        visibilityTime: 4000,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <TouchableOpacity
            style={{ backgroundColor: '#FBBF24', padding: 10, borderTopRightRadius: 16, borderBottomLeftRadius: 16, marginLeft: 16, marginTop: 20 }}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Image source={require('../assets/update.jpg')} style={{ width: 200, height: 200 }} />
        </View>
      </SafeAreaView>
      <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 32, paddingTop: 32, borderTopLeftRadius: 50, borderTopRightRadius: 50, marginTop: '-40%' }}>
        <View style={{ marginBottom: 1 }}>
          <Text style={{ color: '#4B5563', marginLeft: 16 }}>{translate('email address')}</Text>
          <TextInput
            style={{ padding: 16, backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 16, marginBottom: 12 }}
            placeholder="Enter Email"
            onChangeText={setEmail}
            value={email}
          />
          <Text style={{ color: '#4B5563', marginLeft: 16 }}>{translate('password')}</Text>
          <TextInput
            style={{ padding: 16, backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 16, marginBottom: 12 }}
            secureTextEntry
            placeholder="Enter Password"
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity style={{ alignItems: 'flex-end', marginBottom: 20 }}>
            <Text style={{ color: '#4B5563' }}>{translate('forgot password')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={submitHandler} style={{ paddingVertical: 12, backgroundColor: '#FBBF24', borderRadius: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#4B5563', marginLeft: 50 }}>
              {loading ? translate('loading...') : translate('login')}
            </Text>
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
          <Text style={{ color: '#6B7280', fontWeight: '600' }}>{translate('Dont have an account')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ fontWeight: '600', color: '#FBBF24' }}>{translate('sign up')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Toast component for displaying messages */}
      <Toast />
    </View>
  );
}
