import { View, Text, TextInput , StyleSheet, ScrollView ,TouchableOpacity ,Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import Colors from '../constants/Colors'
import { Picker } from '@react-native-picker/picker'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ArrowLeftIcon} from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'

import { useLanguage } from '../LanguageProvider';


export default function ProfileUpdate() {
  
  const { translate } = useLanguage();
    const navigation = useNavigation();
  const [formData , setFormData] = useState([])
  const [category , setCategory] = useState("")
  const [image , setImage] = useState(null)
  const handleInputChanges = (fieldName , fieldValue) =>(
    setFormData(prev =>({
      ...prev ,
      [fieldName] :fieldValue
    }))

    // console.log(fieldName , fieldValue)
  )

  const onSubmit = () =>{
    console.log(formData)
  }

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setImage(imageUri);
      }
    });
  };

  return (
    <ScrollView style={{
      padding:20
    }}>
           <View style={{ flexDirection: 'row', justifyContent: 'flex-start' , marginBottom:20 , marginLeft:-10 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: '#FBBF24', padding: 10, borderTopRightRadius: 16, borderBottomLeftRadius: 16, marginLeft: 16 , marginTop:20 }}
        >
          <ArrowLeftIcon size={20} color='black' />
        </TouchableOpacity>
      </View> 
      <Text style={{
        fontSize:20,
        color:Colors.black
      }}>{translate('update profile')}</Text>
      
    <Pressable onPress={openImagePicker}>
      
      {!image ? <Image source={require('../assets/trekking-hiking-FB.jpg')}  style={{width:100 , height:100 , borderRadius:15 , borderWidth:1 , borderColor: 'grey' ,marginTop:20}}/>:
       <Image source={{uri : image}}  style={{width:100 , height:100 , borderRadius:15 , borderWidth:1 , borderColor: 'grey' ,marginTop:20}}/>}
      </Pressable>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('full name')}</Text>
        <TextInput style={styles.input}  onChangeText={(value) => handleInputChanges('name' , value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}> {translate('comapny Name')} </Text>
        <TextInput style={styles.input}  onChangeText={(value) => handleInputChanges('company' , value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('tin no')}</Text>
        <TextInput keyboardType='numeric'  style={styles.input}  onChangeText={(value) => handleInputChanges('Tin no' , value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}> {translate('registration no')}</Text>
        <TextInput   style={styles.input}  onChangeText={(value) => handleInputChanges('Reg no' , value)} />
      </View>
      <View
      style={styles.inputContainer}>
        <Text style={styles.label}> {translate('how many trips')}</Text>
      <Picker
        selectedValue={category}
         style={styles.input}
          onValueChange={(itemValue, itemIndex) =>{
            setCategory(itemValue);
            handleInputChanges('category' , itemValue)
          }}>
  <Picker.Item label="0 upto 5" value="5" />
  <Picker.Item label="5  upto  20" value="25" />
  <Picker.Item label="20 upto 50" value="50" />
  <Picker.Item label="Above 50" value="above" />
</Picker>
</View>
<View style={styles.inputContainer}>
        <Text style={styles.label}> {translate('phone')}</Text>
        <TextInput style={styles.input}  onChangeText={(value) => handleInputChanges('phone' , value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}> {translate('where do you hear it from')}</Text>
        <TextInput style={styles.input}  onChangeText={(value) => handleInputChanges('where' , value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}> {translate('About Your Company Description')}</Text>
        <TextInput numberOfLines={5} multiline={true} style={styles.input} onChangeText={(value) => handleInputChanges('description' , value)} />
      </View>
      <TouchableOpacity onPress={onSubmit} style={styles.button}>
      <Text style={{textAlign:'center',color:Colors.white }}>{translate('submit')}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  inputContainer :{
    marginVertical :5
  },
  input :{
    padding:15,
    backgroundColor : Colors.white,
    borderRadius :7
  } ,
  label: {
    marginVertical:5, 
    color:'black'
  } ,
  button:{
    padding :15 ,
    backgroundColor :Colors.primaryColor,
    borderRadius :15 ,
    marginVertical:10, marginBottom:20
  }
})