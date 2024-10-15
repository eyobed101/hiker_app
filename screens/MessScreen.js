import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Button } from 'react-native';
import Chatbox from '../component/Chatbox';
import MyChats from '../component/MyChats';
import SideDrawer from '../component/miscellaneous/SideDrawer';
import { ChatState } from '../Context/ChatProvider';

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const [selectedChat, setSelectedChat] = useState(null); // State to track selected chat

  const handleChatSelect = (chat) => {
    setSelectedChat(chat); // Set the selected chat
  };

  const handleBackPress = () => {
    setSelectedChat(null); // Clear selected chat to go back
  };

  return (
    <SafeAreaView style={styles.container}>
      {user && !selectedChat && <SideDrawer />}

      {selectedChat ? ( // Render full screen chat if selectedChat is not null
        <View style={styles.fullScreenContainer}>
          <Button title="Back" onPress={handleBackPress} />
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} chat={selectedChat} />
        </View>
      ) : (
        <View style={styles.content}>
          {user ? (
            <>
              <View style={styles.chatsContainer}>
                <MyChats fetchAgain={fetchAgain} onChatSelect={handleChatSelect} />
              </View>
              <View style={styles.chatboxContainer}>
                <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} chat={selectedChat} />
              </View>
            </>
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
  chatboxContainer: {
    flex: 2,
    backgroundColor: '#e0e0e0',
    marginLeft: 5,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
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
});

export default Chatpage;
