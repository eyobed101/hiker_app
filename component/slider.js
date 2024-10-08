import { View, Text  , FlatList , StyleSheet ,Dimensions, Image } from 'react-native'
import React ,{useEffect , useState , useRef} from 'react'
import { adData } from '../data/ad'

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Timer to change the image every 2 minutes (120000 milliseconds)
    const interval = setInterval(() => {
      // Update index to show the next image, loop back to the first image when reaching the end
      setCurrentIndex(prevIndex => (prevIndex + 1) % adData.length);
    }, 5000); // Change to the desired time in milliseconds

    // Clear interval on unmount to avoid memory leaks
    return () => clearInterval(interval);
  }, [adData]);

  useEffect(() => {
    // Automatically scroll to the current index when it changes
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ animated: true, index: currentIndex });
    }
  }, [currentIndex]);
  
  return (
    <View>
      <FlatList
        data={adData}
        ref={flatListRef}
        horizontal={true}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Image source={{ uri: item?.image }} style={styles.sliderImage} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // Prevent manual scrolling if you want auto-scroll only
      />
    </View>
  );
}

const styles = StyleSheet.create({
    sliderImage :{
        width:Dimensions.get('screen').width*0.9,
        height:200 ,
        borderRadius:15,
        marginRight:15,
    }
})