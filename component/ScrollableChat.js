import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { ChatState } from '../Context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  console.log("loooooo",user)

  const renderItem = ({ item, index }) => (
    <View style={styles.container}>
      {(isSameSender(messages, item, index, user._id) || isLastMessage(messages, index, user._id)) && (
        <TouchableOpacity style={styles.avatarContainer}>
          {/* <Image
            source={{ uri: item.sender.pic }}
            style={styles.avatar}
            accessibilityLabel={item.sender.name} 
          /> */}
          {/* <Text style={styles.tooltip}>{item.sender.username}</Text> */}
        </TouchableOpacity>
      )}
      <View
        style={[
          styles.message,
          {
            backgroundColor: item.sender._id === user._id ? '#BEE3F8' : '#B9F5D0',
            marginLeft: isSameSenderMargin(messages, item, index, user._id),
            marginTop: isSameUser(messages, item, index, user._id) ? 3 : 10,
          },
        ]}
      >
        <Text>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatarContainer: {
    marginRight: 0,
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  tooltip: {
    // position: 'absolute',
    // top: -20,
    backgroundColor: 'black',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    textAlign: 'center',
    // zIndex: 1,
  },
  message: {
    borderRadius: 20,
    color: 'black',
    padding: 12,
    maxWidth: '75%',
  },
});

export default ScrollableChat;
