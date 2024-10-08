import { View, Text, TextInput , StyleSheet, ScrollView ,TouchableOpacity ,Image, Pressable , FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../constants/Colors'
import { Picker } from '@react-native-picker/picker'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useLanguage } from '../LanguageProvider';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import Modal from 'react-native-modal'; // Import modal for the dropdown
import axiosInstance from '../config/axios';



export default function PostScreen() {
 
 
  // const formData = new FormData();

  const { translate } = useLanguage();
  const [formDatas , setFormData] = useState([])
  const [category , setCategory] = useState("")
  const [image , setImage] = useState(null)
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [starttime , setStartTime] = useState(false);
  const [endtime , setEndTime] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility
  const [categories , setCategorires] = useState([]);

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


  const handleInputChanges = (fieldName , fieldValue) =>(
    setFormData(prev =>({
      ...prev ,
      [fieldName] :fieldValue
    }))

      // console.log(fieldName , fieldValue)
  )

  const onSubmit = () => {
    // Ensure FormData is initialized correctly
    let formData = new FormData();

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
  
    // Append other fields to FormData
    formData.append('title', formDatas.title);
    formData.append('description', formDatas.description);
    formData.append('location', formDatas.location);
    formData.append('itinerary', JSON.stringify(selectedItems));  // Convert array to string
    formData.append('startDate', formattedStartDate);
    formData.append('endDate', formattedEndDate);
    formData.append('price', formDatas.price);
    formData.append('maxParticipants', formDatas.participant);
    formData.append('categories', category);
  
    // Append the image as an array (even if there's only one image)
    if (image) {
      formData.append('images', {
        uri: image, // The URI of the image
        name: 'photo.jpg', // A default file name
        type: 'image/jpeg', // MIME type
      });
    }
  
    // Log FormData to check its content
    console.log("FormData:", formData);
  
    // Since formData.entries() is not always available in React Native, you can manually log fields:
    formData._parts.forEach((part) => {
      console.log(`${part[0]}: ${part[1]}`);
    });
  
    // Send the POST request
    axiosInstance.post('/event/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Response:', response.data);
        setSelectedItems([]); // Reset selected items after successful request
        Alert.alert("Event Posted Successfully")
        setFormData([])
      })
      .catch(error => {
        console.error('Error creating event:', error);
      });
  }; 

  
  
  

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

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
        let asset = response.assets?.[0];  // Check assets array
    
        if (asset) {
          let imageUri = asset.uri;
          let fileName = asset.fileName || 'photo.jpg';
          let type = asset.type || 'image/jpeg';
    
          setImage(imageUri);
    
          // if (imageUri) {
          //   // Create FormData and append the image
          //   formData.append('images', {
          //     uri: imageUri,
          //     name: fileName,
          //     type: type,
          //   });
          // }
        } else {
          console.log('No asset found in response');
        }
      }
    });
    
  };


  const renderStartDate =() =>{
    return(
 <View>

  <DateTimePicker
        mode="single"
        date={startDate}
        onChange={(params) => setStartDate(params.date)}
        calendarTextStyle={{color:'black'}}
        headerTextStyle={{color:'black'}}
        selectedItemColor='blue'	
        
      />
 </View>
    );
  }

  const renderendDate =() =>{
    return(
 <View>

  <DateTimePicker
        mode="single"
        date={endDate}
        onChange={(params) => setEndDate(params.date)}
        calendarTextStyle={{color:'black'}}
        headerTextStyle={{color:'black'}}
        selectedItemColor='green'	

      />
 </View>
    );
  }


  return (
    <ScrollView style={{
      padding:20
    }}>
      <Text style={{
        fontSize:20,
        color:Colors.black
      }}>{translate('add new hiking')}</Text>

      
      
    <Pressable onPress={openImagePicker}>
      
      {!image ? <Image source={require('../assets/trekking-hiking-FB.jpg')}  style={{width:100 , height:100 , borderRadius:15 , borderWidth:1 , borderColor: 'grey' ,marginTop:20}}/>:
       <Image source={{uri : image}}  style={{width:100 , height:100 , borderRadius:15 , borderWidth:1 , borderColor: 'grey' ,marginTop:20}}/>}
      </Pressable>
      <View style={styles.inputContainer}>
        <Text style={styles.label}> {translate('hike name')}</Text>
        <TextInput style={styles.input}  onChangeText={(value) => handleInputChanges('title' , value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('hike location')}</Text>
        <TextInput style={styles.input}  onChangeText={(value) => handleInputChanges('location' , value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('hike duration')}</Text>
        <TextInput  style={styles.input}  placeholder={startDate.toString()}   placeholderTextColor="gray" // Change this to your desired color
   />
        {starttime ?
        <TouchableOpacity style={{justifyContent:'center' , backgroundColor:'blue' , borderRadius:10, padding:10 }} onPress={() => setStartTime(false)} >
<Text style={{textAlign:'center' , color:'white'}}> Close </Text>
  </TouchableOpacity>
  : 
  <TouchableOpacity style={{justifyContent:'center' , backgroundColor:'blue' , borderRadius:10, padding:10 }} onPress={() => setStartTime(true)} >
  <Text style={{textAlign:'center' , color:'white'}}> Open </Text>
    </TouchableOpacity>
  }

  {starttime ?
    renderStartDate() : null
   
}
              <Text style={styles.label}>{translate('up to')}</Text>
              <TextInput  style={styles.input}  placeholder={endDate.toString()}  placeholderTextColor="gray"  />

              {endtime ?
        <TouchableOpacity style={{justifyContent:'center' , backgroundColor:'green' , borderRadius:10, padding:10 }} onPress={() => setEndTime(false)} >
<Text style={{textAlign:'center' , color:'white'}}> Close </Text>
  </TouchableOpacity>
  : 
  <TouchableOpacity style={{justifyContent:'center' , backgroundColor:'green' , borderRadius:10, padding:10 }} onPress={() => setEndTime(true)} >
  <Text style={{textAlign:'center' , color:'white'}}> Open </Text>
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
        <TextInput keyboardType='numeric' style={styles.input}  onChangeText={(value) => handleInputChanges('price' , value)} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('maximum hike participants')}</Text>
        <TextInput keyboardType='numeric' style={styles.input}  onChangeText={(value) => handleInputChanges('participant' , value)} />
      </View>
      <View style={styles.inputContainer}>
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
        <Text style={{color:'black'}}>Selected Items: {selectedItems.map(id => `Item ${id}`).join(', ') || 'None'}</Text>
      </View>

      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('hike description')}</Text>
        <TextInput numberOfLines={5} multiline={true} style={styles.input} onChangeText={(value) => handleInputChanges('description' , value)} />
      </View>
      <TouchableOpacity onPress={onSubmit} style={styles.button}>
      <Text style={{textAlign:'center' , color:Colors.white }}>{translate('submit')}</Text>
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
    borderRadius :7 ,
    color:Colors.black
  } ,
  label: {
    marginVertical:5,
    color:Colors.black
  } ,
  button:{
    padding :15 ,
    backgroundColor :Colors.primaryColor,
    borderRadius :15 ,
    marginVertical:10, marginBottom:20
  },
 dropdownButton: {
    padding: 15,
    backgroundColor: '#4caf50',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: '#4caf50', // Highlight selected items
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  selectedItemsContainer: {
    marginTop: 20,
  },
})