import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ChatState } from '../../Context/ChatProvider';

const UserListItem = ({ handleFunction }) => {
  const { user } = ChatState();

  return (
    <TouchableOpacity
      onPress={handleFunction}
      style={styles.container}
    >
      {/* Avatar */}
      {/* <Image
        style={styles.avatar}
        source={{ uri: user.pic }} // Assuming user.pic is a URL
      /> */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userEmail}>
          <Text style={styles.bold}>Email: </Text>
          {user.email}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 10,
    // Add a hover effect for React Native (touch feedback)
  },
  avatar: {
    width: 40, // Avatar size
    height: 40,
    borderRadius: 20, // Circular avatar
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'black',
  },
  userEmail: {
    fontSize: 12,
    color: 'black',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default UserListItem;
