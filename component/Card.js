import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useLanguage } from '../LanguageProvider';

export default function Card({ dataList , navigation }) {
    console.log("val" , dataList.length)
    const { translate } = useLanguage();

  return (
    <FlatList
      data={dataList}
      keyExtractor={(item, index) => index.toString()}
      style={{marginTop:10}}
      numColumns={2} // Display two items per row
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}  onPress={() =>   navigation.navigate("Description", {data:item})
       }>
          <Image
            source={{ uri: item?.multimedia[0] }}
            style={styles.hikeImage}
          />
          <Text style={styles.hikeName}>{item?.title}</Text>
          <View style={styles.hikeInfo}>
            <Text style={styles.hikeLocation}>{item?.location}</Text>
            <Text style={styles.hikePrice}>{item?.price} {translate('br')}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  card: {
    width: Dimensions.get('screen').width * 0.45, // Adjust width for two items per row
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginLeft:5,
  },
  hikeImage: {
    width: '97%',
    alignSelf:'center',
    height: 90,
    borderRadius: 10,
    marginBottom: 10,
  },
  hikeName: {
    fontSize: 12,
    marginBottom: 5,
    color:'black'
  },
  hikeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hikeLocation: {
    color: 'gray',
    fontSize: 12,
  },
  hikePrice: {
    color: 'blue',
    paddingHorizontal: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 12,
  },
});
