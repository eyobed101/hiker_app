import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../constants/Colors'
import { Picker } from '@react-native-picker/picker'
import { launchImageLibrary } from 'react-native-image-picker';

import { useLanguage } from '../LanguageProvider';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import Modal from 'react-native-modal'; // Import modal for the dropdown
import axiosInstance from '../config/axios';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { Alert } from 'react-native';

import * as FileSystem from 'expo-file-system';





export default function PostScreen() {


  // const formData = new FormData();

  const { translate } = useLanguage();
  // const [formDatas, setFormData] = useState([])
  const [formData, setFormData] = useState({});
  const [category, setCategory] = useState("")
  const [image, setImage] = useState(null)
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [starttime, setStartTime] = useState(false);
  const [endtime, setEndTime] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility
  const [categories, setCategorires] = useState([]);
  const [images, setImages] = useState([]);
  const maxImages = 4;



  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the date string
    const year = date.getFullYear(); // Get the full year (YYYY)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (MM)
    const day = String(date.getDate()).padStart(2, '0'); // Get the day (DD)

    return `${year}-${month}-${day}`; // Return formatted date
  };

  // Example usage
  const originalDate = "Sun, 06 Oct 2024 21:00:00 GMT";
  const formattedDate = formatDate(originalDate);
  console.log(formattedDate); // Output: "2024-10-06"




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
      setCategorires(fetchedData);
    };
    fetchDataAndSetState();
  }, []);




  const items = [
    { id: 'Cam Fire', name: 'Cam Fire' },
    { id: 'Games', name: 'Games' },
    { id: 'Swimming', name: 'Swimming' },
    { id: 'Lumch and Dinner', name: 'Lumch and Dinner' },
    { id: 'Refreshments', name: 'Refreshments' },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  // Toggle item selection
  const toggleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      // Remove item from selected list if already selected
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      // Add item to selected list
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Check if an item is selected
  const isItemSelected = (itemId) => selectedItems.includes(itemId);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        isItemSelected(item.id) && styles.selectedItem, // Highlight selected item
      ]}
      onPress={() => toggleSelectItem(item.name)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );


  const handleInputChanges = (fieldName, fieldValue) => (
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))

    // console.log(fieldName , fieldValue)
  )
const onSubmit = async () => {
  let formDataToSend = new FormData();

  formDataToSend.append('title', formData.title);
  formDataToSend.append('description', 'huu');
  formDataToSend.append('location', formData.location);
  formDataToSend.append('startDate', startDate.toISOString());
  formDataToSend.append('endDate', endDate.toISOString());
  formDataToSend.append('price', formData.price);
  formDataToSend.append('maxParticipants', formData.participant);
  formDataToSend.append('categories', category);

  // // Ensure the correct field name 'images'
  // images.forEach((imageUri, index) => {
  //   const fileExtension = imageUri.split('.').pop(); // Get the file extension
  //   const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

  //   formDataToSend.append('images', {
  //     uri: imageUri,
  //     name: `image_${index}.${fileExtension}`, // Ensure proper file extension
  //     type: mimeType, // Set the correct MIME type
  //   });
  // });

  for (const imageUri of images) {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    const fileExtension = imageUri.split('.').pop();
    const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

    // Check if the file exists
    if (!fileInfo.exists) {
      console.error(`File does not exist: ${imageUri}`);
      return; // Stop the submission if the file is missing
    }

    formDataToSend.append('images', {
      uri: fileInfo.uri,
      name: `image_${images.indexOf(imageUri)}.${fileExtension}`,
      type: mimeType, // Set the correct MIME type
    });

    // const imageFile = {
    //   uri: fileInfo.uri,
    //   // name: `image_${index}.${fileExtension}`,
    //   type: mimeType,
    // };

    // console.log("Appending image:", imageFile);
    // formDataToSend.append('images', imageFile.uri);
  }


  console.log("log the data before sending", formDataToSend);

  const axiosInstance2 = axios.create({
    // baseURL: 'http://192.168.137.234:5000/api/v1.0/',
    baseURL: 'https://hikeapi.issipeteta.net/api/v1.0/',
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  });
  
  axiosInstance2.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem('token'); // Ensure the token key matches what you use
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  try {
    const response = await axiosInstance2.post('event/create', formDataToSend);
    Alert.alert('Event Posted Successfully');
    setFormData({});
    setImages([]);
  } catch (error) {
    if (error.response) {
      console.error('Error details:', error.response);
    } else {
      console.error('Error creating event:', error.message);
    }
  }
};

  
  

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(index)}
      >
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );



  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const openImagePicker = async () => {
    if (images.length >= maxImages) {
      Alert.alert(`You can upload a maximum of ${maxImages} images.`);
      return;
    }
  
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }
  
    // Launch the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (result.canceled) {
      console.log('User cancelled image picker');
    } else {
      const newImage = result.assets[0].uri; // Updated to match the returned structure
      console.log("Selected image URI:", newImage); // Log the URI to verify it
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };
  

  const renderStartDate = () => {
    return (
      <View>

        <DateTimePicker
          mode="single"
          date={startDate}
          onChange={(params) => setStartDate(params.date)}
          calendarTextStyle={{ color: 'black' }}
          headerTextStyle={{ color: 'black' }}
          selectedItemColor='blue'

        />
      </View>
    );
  }

  const renderendDate = () => {
    return (
      <View>

        <DateTimePicker
          mode="single"
          date={endDate}
          onChange={(params) => setEndDate(params.date)}
          calendarTextStyle={{ color: 'black' }}
          headerTextStyle={{ color: 'black' }}
          selectedItemColor='green'

        />
      </View>
    );
  }


  return (
    <ScrollView style={{
      padding: 20
    }}>
      <Text style={{
        fontSize: 20,
        color: Colors.black
      }}>{translate('add new hiking')}</Text>


      <TouchableOpacity onPress={openImagePicker} style={styles.uploadButton}>
        <Text style={styles.uploadText}>{translate('Upload Images')}</Text>
      </TouchableOpacity>

      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        style={styles.imageList}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}> {translate('hike name')}</Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChanges('title', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('hike location')}</Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChanges('location', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('hike duration')}</Text>
        <TextInput style={styles.input} placeholder={startDate.toString()} placeholderTextColor="gray" // Change this to your desired color
        />
        {starttime ?
          <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: 'blue', borderRadius: 10, padding: 10 }} onPress={() => setStartTime(false)} >
            <Text style={{ textAlign: 'center', color: 'white' }}> Close </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: 'blue', borderRadius: 10, padding: 10 }} onPress={() => setStartTime(true)} >
            <Text style={{ textAlign: 'center', color: 'white' }}> Open </Text>
          </TouchableOpacity>
        }

        {starttime ?
          renderStartDate() : null

        }
        <Text style={styles.label}>{translate('up to')}</Text>
        <TextInput style={styles.input} placeholder={endDate.toString()} placeholderTextColor="gray" />

        {endtime ?
          <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: 'green', borderRadius: 10, padding: 10 }} onPress={() => setEndTime(false)} >
            <Text style={{ textAlign: 'center', color: 'white' }}> Close </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: 'green', borderRadius: 10, padding: 10 }} onPress={() => setEndTime(true)} >
            <Text style={{ textAlign: 'center', color: 'white' }}> Open </Text>
          </TouchableOpacity>
        }

        {endtime ?
          renderendDate() : null

        }
      </View>
      <View
        style={styles.inputContainer}>
        <Text style={styles.label}>{translate('hike category')}</Text>
        <Picker
          selectedValue={category}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => {
            setCategory(itemValue);
            handleInputChanges('category', itemValue);
          }}
        >
          {categories.map((categoryItem) => (
            <Picker.Item
              key={categoryItem._id} // Set the key as the _id
              label={categoryItem.name} // Show the name in the dropdown
              value={categoryItem._id} // Use the _id as the value
            />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('hike price')}</Text>
        <TextInput keyboardType='numeric' style={styles.input} onChangeText={(value) => handleInputChanges('price', value)} />
      </View>
      <TouchableOpacity onPress={onSubmit} style={styles.button}>
        <Text style={{ textAlign: 'center', color: Colors.black }}>{translate('submit')}</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('maximum hike participants')}</Text>
        <TextInput keyboardType='numeric' style={styles.input} onChangeText={(value) => handleInputChanges('participant', value)} />
      </View>
      {/* <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('Itenerary')}</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleModal}>
          <Text style={styles.buttonText}>Select Items</Text>
        </TouchableOpacity>

        <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              extraData={selectedItems}
            />
          </View>
        </Modal>
        <View style={styles.selectedItemsContainer}>
          <Text style={{ color: 'black' }}>Selected Items: {selectedItems.map(id => `Item ${id}`).join(', ') || 'None'}</Text>
        </View>

      </View> */}
      {/* <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('hike description')}</Text>
        <TextInput numberOfLines={5} multiline={true} style={styles.input} onChangeText={(value) => handleInputChanges('description', value)} />
      </View> */}
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
  },
  imageList: {
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    padding: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop:"-34px"
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});