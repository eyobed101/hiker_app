import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import axiosInstance from '../config/axios';
import { getSender } from '../config/ChatLogics';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { ChatState } from '../Context/ChatProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axiosInstance.get('/chat', config);
      console.log('here is the data', data);
      setChats(data);
    } catch (error) {
      Alert.alert('Error Occurred!', 'Failed to Load the chats', error);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        setLoggedUser(JSON.parse(userInfo));
      }
    };

    getUserInfo();
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Chats</Text>
        <GroupChatModal>
          <Button
            style={styles.groupChatButton}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </View>
      <View style={styles.chatContainer}>
        {chats ? (
          <ScrollView>
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat._id}
                onPress={() => setSelectedChat(chat)}
                style={[
                  styles.chatBox,
                  { backgroundColor: selectedChat === chat ? '#38B2AC' : '#E8E8E8' },
                ]}
              >
                <Text style={{ color: selectedChat === chat ? 'white' : 'black' }}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage ? (
                  <Text style={styles.latestMessage}>
                    <Text style={styles.bold}>
                      {chat.latestMessage.sender.name}:
                    </Text>
                    {chat.latestMessage.content.length > 50
                      ? `${chat.latestMessage.content.substring(0, 51)}...`
                      : chat.latestMessage.content}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ChatLoading />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Work Sans',
  },
  groupChatButton: {
    fontSize: 17,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  chatBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  latestMessage: {
    fontSize: 12,
    color: 'gray',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default MyChats;
