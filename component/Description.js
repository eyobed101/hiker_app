import { View, Text, TouchableOpacity, SafeAreaView, Image, StyleSheet, Linking } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, StarIcon, ClockIcon, BanknotesIcon, MapIcon } from 'react-native-heroicons/solid';
import Colors from '../constants/Colors';
import { useLanguage } from '../LanguageProvider';

export default function Description({ route }) {
  const data = route.params.data;
  const navigation = useNavigation();
  const { translate } = useLanguage();
  console.log("duol" , data)
  const itinerary = JSON.parse(data.itinerary[0]);


  const openGoogleMaps = () => {
    const locationUrl = `https://www.google.com/maps/search/?api=1&query=${data?.location}`;
    Linking.openURL(locationUrl);
  };

  const rateInGoogle = () => {
    const businessName = encodeURIComponent(data?.businessName); // Encode the business name for URL
    const googleRateUrl = `https://www.google.com/search?q=${businessName}+reviews`;
    Linking.openURL(googleRateUrl);
  };
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
  
    // Manually setting "Sunday"
    const dayOfWeek = "Sunday";
  
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate(); // get the day of the month (08)
    const month = monthNames[date.getMonth()]; // get the month name (Oct)
  
    return `${dayOfWeek}, ${month} ${day}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Image Container */}
      <View>
        {/* Background Image */}
        <Image
          source={{ uri: data?.multimedia[0] }}
          style={{ width: '100%', height: 330, objectFit: 'cover' }}
        />

        {/* Back Button on top of the Image */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeftIcon size={20} color='black' />
        </TouchableOpacity>

        {/* Google Maps Icon - Top Right Corner */}
        <TouchableOpacity
          onPress={openGoogleMaps}
          style={styles.mapButton}
        >
          <MapIcon size={25} color='black' />
        </TouchableOpacity>
      </View>

      {/* Name Container - Below the Image */}
      <View style={{flexDirection:'row' , flex:1 , justifyContent:'space-between' , alignContent:'center'}}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          {data?.title}
        </Text>
        <Text style={{ fontSize: 16, color: 'grey', marginTop: 5 }}>
          {data?.categories?.name}
        </Text>
      </View>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <TouchableOpacity style={styles.rateButton} onPress={rateInGoogle}>
          <Text style={styles.rateButtonText}>Rate in Google</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Details Section */}
      <View style={{ padding: 10 }}>
        {/* Rating and Duration */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.detailContainer}>
            <StarIcon size={20} color='#FBBF24' />
            <Text style={styles.detailText}>{data?.rating}</Text>
          </View>
          <View style={styles.detailContainer}>
            <ClockIcon size={20} color='#FBBF24' />
            <Text style={styles.detailText}>{formatDate(data?.startDate)} upto  {formatDate(data?.endDate)}</Text>
          </View>
        </View>

        {/* Location and Price */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.detailContainer}>
            <MapIcon size={20} color='#FBBF24' />
            <Text style={styles.detailText}>{data?.location}</Text>
          </View>
          <View style={styles.detailContainer}>
            <BanknotesIcon size={20} color='#FBBF24' />
            <Text style={styles.detailText}>{data?.price} Birr</Text>
          </View>
        </View>
      </View>

      {/* Description Section */}
      <View style={{ padding: 20 }}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
          {translate('About')}
        </Text>
        <Text style={{ color: 'grey', fontSize: 14, marginTop: 5 }}>
          {data?.description}
        </Text>
        <Text style={{ color: 'grey', fontSize: 14, marginTop: 5 }}>
          It Contains
        </Text>
        {itinerary ? (
        itinerary.map((item, index) => (
          <Text style={{color: 'grey', fontSize: 14,}} key={index}>{item}</Text>  // Display each item
        ))
      ) : (
        <Text>''</Text>
      )}
      </View>

      {/* Rate in Google Button */}
    

      {/* Bottom Section */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.adoptbtn} 
        // onPress={() => Linking.openURL(`tel:${data.phone}`)}
        >
          <Text style={styles.buttonText}>{translate('Make Reservation')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: '#FBBF24',
    padding: 10,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    justifyContent: 'center',
  },
  mapButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: '#FBBF24',
    padding: 10,
    borderRadius: 50, // Circular button
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 10,
    margin: 5,
    borderRadius: 15,
    flex: 1,
  },
  detailText: {
    fontSize: 16,
    color: 'grey',
    marginLeft: 10,
  },
  bottom: {
    padding: 20,
    marginTop: 'auto',
    bottom:0
  },
  adoptbtn: {
    backgroundColor: "blue",
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.white,
  },
  rateButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom:20,
    height:50
  },
  rateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
