import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useSelector } from 'react-redux';
import axiosInstance from '../config/axios';
import { Avatar } from 'react-native-elements'; // Make sure to install this package



const InboxScreen = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const current = useSelector((state) => state.user);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  
  const navigation = useNavigation();

  // Use useFocusEffect to fetch chats when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchChats = async () => {
        setLoading(true); // Set loading to true while fetching
        try {
          const response = await axiosInstance.get('/auth/chat');
          setChats(response.data.chats);
          console.log("Fetched chats:", response.data);
        } catch (error) {
          console.error('Error fetching chats:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };

      fetchChats();
    }, []) // Dependency array: empty means it runs on focus
  );

  const renderChatItem = ({ item }) => {
    const currentUsername = current.username; // Assuming you have current.username from Redux state
    const otherMembers = item.members.filter(member => member.username !== currentUsername); // Filter out the current user
    const participants = otherMembers.map(member => member.username).join(', ');
  
    // Function to generate random colors for avatars
    const generateRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { chatId: item._id })}>
        <View style={styles.chatItems}>
          {otherMembers.map(member => (
            <View key={member._id} style={styles.participantContainers}>
              <Avatar
                rounded
                size="medium"
                containerStyle={{ backgroundColor: generateRandomColor() }}
                title={member.username.charAt(0)} // Display first letter of the username as a placeholder
              />
              <Text style={styles.chatTexts}>{`${member.username}`}</Text>
            </View>
          ))}
          {/* <Text style={styles.participantTexts}>{`Chat with ${participants}`}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };
  
  const openUserModal = async () => {
    setLoadingUsers(true);
    console.log("Opening user modal...");
    
    try {
      const response = await axiosInstance.get('auth/users'); // Fetch users from the API
      const { Superadmins, EventOrganizers, Hikers } = response.data;
  
      // Combine users from different roles into one array
      const allUsers = [
        ...Superadmins.map(user => ({ ...user, role: 'Superadmin' })),
        ...EventOrganizers.map(user => ({ ...user, role: 'Event Organizer' })),
        ...Hikers.map(user => ({ ...user, role: 'Hiker' }))
      ];
  
      setUsers(allUsers);
      console.log("Fetched users:", allUsers);
  
      // Find the logged-in user based on the current username
      const loggedInUser = allUsers.find(user => user.username === current.username);
      if (loggedInUser) {
        setLoggedInUserId(loggedInUser.id); // Set logged-in user's ID
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
      setModalVisible(true);
    }
  };

  const createNewChat = async (userId2) => {
    try {
      // Ensure both `loggedInUserId` and `userId2` are defined and valid
      if (loggedInUserId && userId2) {
        const response = await axiosInstance.post('auth/chat', {
          members: [loggedInUserId, userId2], // Sending logged-in user's ID and the selected user ID as an array
        });
        
        console.log('Members:', loggedInUserId, userId2); // Logging member IDs
        console.log('Chat created:', response.data); // Logging response
        
        setModalVisible(false); // Closing modal after chat creation
        
        // Optionally, refresh the chat list after creation
        // Example: fetchChats(); // Call this if you want to refresh chats immediately after creating a chat
      } else {
        console.error('User IDs are not valid. Cannot create chat.');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => createNewChat(item.id)}> 
      <View style={styles.userItem}>
        <Text style={styles.userText}>{item.username} ({item.role})</Text> 
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={renderChatItem}
        />
      )}

      {/* Create New Chat Button */}
      <TouchableOpacity style={styles.createChatButton} onPress={openUserModal}>
        <Text style={styles.createChatButtonText}>Create New Chat</Text>
      </TouchableOpacity>

      {/* Modal for displaying user list */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select User to Chat</Text>
            {loadingUsers ? (
              <ActivityIndicator size="large" />
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id}  
                renderItem={renderUserItem}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  chatText: {
    fontSize: 16,
    color: '#333',
  },

    chatItems: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderColor: '#ddd',
      marginTop:20
    },
    participantContainers: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    chatTexts: {
      fontSize: 16,
      color: '#333',
      marginLeft:10
    },
    participantTexts: {
      fontSize: 14,
      color: '#666',
      marginTop: 5,
    },

  createChatButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  createChatButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 16,
    color:'black'
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default InboxScreen;
