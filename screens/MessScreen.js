import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Button, Text } from 'react-native';
import Chatbox from '../component/Chatbox';
import MyChats from '../component/MyChats';
import SideDrawer from '../component/miscellaneous/SideDrawer';
import { ChatState } from '../Context/ChatProvider';

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { selectedChat, setSelectedChat, user} = ChatState();


  const handleChatSelect = (chat) => {
    setSelectedChat(chat); // Set the selected chat
  };

  const handleBackPress = () => {
    setSelectedChat(null); // Clear selected chat to go back
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fullScreenContainer}>
        {user && !selectedChat && <SideDrawer />}
      </View>

      {selectedChat ? (
        <View style={styles.fullScreenChatbox}>
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} chat={selectedChat} />
        </View>
      ) : (
        <View style={styles.content}>
          {user ? (
            <View style={styles.chatsContainer}>
              <MyChats fetchAgain={fetchAgain} onChatSelect={handleChatSelect} />
            </View>
          ) : (
            <View style={styles.noUserContainer}>
              <Text style={styles.noUserText}>No user found. Please log in.</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenContainer: {
    // flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenChatbox: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    padding: 10,
  },
  chatsContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginRight: 5,
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserText: {
    fontSize: 18,
    color: 'red',
  },
  backButton: {
    marginBottom: 10,
  },
});

export default Chatpage;
