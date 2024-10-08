import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat , InputToolbar ,Bubble} from 'react-native-gifted-chat';
import io from 'socket.io-client';
import { useRoute , useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/axios';
import {ArrowLeftIcon} from 'react-native-heroicons/solid'
import { StyleSheet , View , TouchableOpacity , Text} from 'react-native';


const socket = io('http://172.20.83.27:5000'); // Your WebSocket URL

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const current = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const route = useRoute();
  const navigation = useNavigation(); // Use the navigation hook
  const { chatId } = route.params; // Get chatId from route params
  


  // Fetch users and find logged-in user's ID
  const fetchUsers = async () => {
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
  
      // Find logged-in user's ID based on username
      const loggedInUser = allUsers.find((user) => user.username === current.username);
      if (loggedInUser) {
        setLoggedInUserId(loggedInUser.id); // Use 'id' instead of '_id'
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  useEffect(() => {
    fetchUsers();

    // Fetch chat history from the server
    const fetchChatHistory = async () => {
        console.log(chatId)
        try {
          const response = await axiosInstance.get(`auth/messages/${chatId}`);
          console.log("watse" , response.data)
          const formattedMessages = response.data.messages.map((message) => ({
            _id: message._id, // Using _id directly from message object
            text: message.message, // Message text from message object
            createdAt: new Date(message.createdAt), // Correct timestamp field
            user: {
              _id: message.sender.username, // Using sender username as _id for user
              name: message.sender.username, // Using sender username as name
            },
          }));
          setMessages(formattedMessages);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
      

    fetchChatHistory();

    // Connect to the socket and join the chat
    socket.emit('join-chat', chatId);

    // Listen for new messages
    socket.on('receive-message', (message) => {
        const receivedMessage = {
            _id: message._id || '', // Ensure there's an ID
            text: message.message || '', // Fallback to empty string if message is undefined
            createdAt: new Date(message.createdAt) || new Date(), // Default to current date if undefined
            user: {
              _id: message.sender?.username || 'unknown', // Safely access sender username
              name: message.sender?.username || 'Unknown User', // Safely access sender name
            },
          };
          
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, receivedMessage)
      );
    });

    // Clean up socket listeners on unmount
    return () => {
      socket.off('receive-message');
    };
  }, [chatId]);

  const onSend = useCallback(
    (messages = []) => {
      if (!loggedInUserId) return; // Wait for logged-in user ID to be set
  
      const message = messages[0];
  
      // Send the message via WebSocket, matching the required structure
      socket.emit('send-message', {
        chatId,
        senderId: loggedInUserId, // Use logged-in user's ID
        message: message.text,
        messageType: 'text', // Default message type to 'text'
        image: '', // Add support for image if needed later
        video: '', // Add support for video if needed later
        audio: ''  // Add support for audio if needed later
      });
  
      // Update the message list locally
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [chatId, loggedInUserId]
  );

  const renderHeader = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f8f8f8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
           <ArrowLeftIcon size={20} color='black' />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' , color:'black'}}>Chat</Text>
      </View>
    );
  };

  const customtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          color:'black'
          
        }}
      />
    );
  };
  

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <GiftedChat
  messages={messages}
  onSend={(messages) => onSend(messages)}
  user={{
    _id: loggedInUserId,
  }}
  renderInputToolbar={(props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        padding: 5,
      }}
    />
  )}
  renderBubble={(props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0084ff', // Sent message bubble color
        },
        left: {
          backgroundColor: '#f0f0f0', // Received message bubble color
        },
      }}
      textStyle={{
        right: {
          color: 'white', // Sent message text color
        },
        left: {
          color: 'black', // Received message text color
        },
      }}
    />
  )}
  textInputStyle={{
    color: 'black', // Text input color when typing
  }}
/>
    </View>
  );
};


const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#f8f8f8',
    },
    backButton: {
      marginRight: 10,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default ChatScreen;


