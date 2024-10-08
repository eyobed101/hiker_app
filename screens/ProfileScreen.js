import { View, Text , Image, FlatList , Dimensions, TouchableOpacity , StyleSheet} from 'react-native'
import React , {useState} from 'react'
import Colors from '../constants/Colors'
import {UserMinusIcon ,  PlusIcon , InboxIcon , UserCircleIcon} from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import { useLanguage } from '../LanguageProvider'
import { useDispatch, useSelector } from "react-redux";
import { userAction } from '../redux/user'
import AsyncStorage from '@react-native-async-storage/async-storage'




export default function ProfileScreen() {
  
  const navigation = useNavigation()
  const [languageVal, setLanguageVal ,] = useState('en')
  const { language, toggleLanguage, translate } = useLanguage();
  const current = useSelector((state) => state.user);

  
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('username');

        dispatch(userAction.logout());

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const handleLanguageChange = (value) => {
  
    setLanguageVal(value);
    toggleLanguage(value);

  
}

  const Menu = [
    {
      id:1 ,
      name : `${translate('edit profile')}`,
    },
   
    {
      id:2 ,
      name : `${translate('inbox')}`,
    },

    {
      id:3 ,
      name : `${translate('add new hiking')}`,
    },
    {
      id:4 ,
      name : `${translate('logout')}`,
    },

   
  ]


  const OnPressMenu = (menu) =>{
    console.log(menu)
    if(menu.id == 4){
      handleLogout()
    }else if (menu.id == 2){
      navigation.navigate('Inbox')
    } else if (menu.id == 3){
      navigation.navigate('Plus')
    }else {
      navigation.navigate('ProfileUpdate')
    }
  }
  return (
    <View style={{
      padding:20,
      marginTop :20
    }}>
      <Text style={{
        fontSize:30
      }}>{translate('profile')}</Text>
      <View style={{
        display:'flex',
        alignItems:'center',
        marginVertical:25
      }}>
       <Image
       source={require('../assets/trekking-hiking-FB.jpg')}
       style={{
        width:80,
        height:80,
        borderRadius :99
       }}
       
       />

       <Text style={{fontSize:20 , fontWeight:'bold' , color:'black'}} >{current?.username} </Text>
       <Text style={{fontSize:16 , color: 'grey' , marginBottom:40}} >{current?.email}  </Text>


       <FlatList 
       data={Menu}
       renderItem={({item , index}) =>{
        return(
        <TouchableOpacity 
        onPress={() => OnPressMenu(item)}
        key={item?.id}
        style={{
          marginVertical:10 ,
          display:'flex',
          flexDirection:'row',
          alignItems :'center' ,
          gap:10 ,
          backgroundColor : Colors.white,
          width : Dimensions.get('screen').width *0.9,
          padding :10 ,
          borderRadius :10
        }}>
          {(item?.id == 1)? <UserCircleIcon size={30} color={Colors.primaryColor}  style={{
            padding :10 ,
            backgroundColor : Colors.bgColor ,
            borderRadius :8
          }}/> :(item?.id == 3)? <PlusIcon size={30} color={Colors.primaryColor}  style={{
            padding :10 ,
            backgroundColor : Colors.bgColor ,
            borderRadius :8
          }}/> :(item?.id == 2) ?
           <InboxIcon  size={30} color={Colors.primaryColor} style={{
            padding :10 ,
            backgroundColor : Colors.bgColor ,
            borderRadius :8
          }}/> :
            <UserMinusIcon size={30} color={Colors.primaryColor} style={{
              padding :10 ,
              backgroundColor : Colors.bgColor ,
              borderRadius :8
            }} />   }
           <Text style={{
            fontSize:20,
            color:'black'
           }}>
             {item.name}
           </Text>
          </TouchableOpacity>
        )
       }}
       />

<View style={styles.row}>
       <Text style={{fontSize:20 , marginLeft:20 , fontWeight:'bold' , color:'black' }}>{translate('language')}</Text>
         <Picker
          selectedValue={languageVal}
          onValueChange={handleLanguageChange}
          style={styles.pickers}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="አማርኛ" value="am" />
          <Picker.Item label="Affan Oromo" value="or" />
        </Picker> 
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  pickers: {
    height: 50,
    width: '60%',
    backgroundColor: '#FFF',
    color:'#333',
    borderColor: '#676767',
    borderWidth: 2,
    borderRadius: 4,  
    marginRight: 20,
    marginLeft: '20%',
  },
 
 

  picker: {
    height: 50,
    width: 400,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 8,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin:40,
    backgroundColor:Colors.white ,
    paddingVertical:10 ,
    borderRadius:10
  },
  halfWidth: {
    width: '40%',
  },
  marginRight: {
    marginRight: 20,
  },
});