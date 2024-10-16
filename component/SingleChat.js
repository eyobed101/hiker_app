import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ScrollableChat from "./ScrollableChat";
import LottieView from "lottie-react-native";
import animationData from "../animations/typing";
import io from "socket.io-client";
import axiosInstance from '../config/axios';
import { Ionicons } from '@expo/vector-icons';


const ENDPOINT = "http://172.20.83.27:5000"; // Backend endpoint
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      console.log("Selected", selectedChat._id)
      const { data } = await axiosInstance.get(`/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Error Occurred! Failed to load the messages.");
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const { data } = await axiosInstance.post("/message", {
          content: newMessage,
          chatId: selectedChat._id,
        }, {
          headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` }
        });
        setNewMessage("");
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]); // Use functional update
      } catch (error) {
        alert("Error Occurred! Failed to send the message.");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect(); // Clean up the socket connection
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]); // Use functional update
      }
    });
  }, [notification]);

  const typingHandler = (text) => {
    setNewMessage(text);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
          
            <TouchableOpacity onPress={() => setSelectedChat(null)}>
              <Ionicons name="arrow-back" size={24} color="#000" marginRight={15}/>
            </TouchableOpacity>

            {/* Avatar */}
            <Image
              source={{ uri: selectedChat.isGroupChat ? '/path/to/group-avatar.png' : user.avatar }}
              style={styles.avatar}
            />
            {messages && (
              !selectedChat.isGroupChat ? (
                <Text>{getSender(user, selectedChat.users) || "Unknown Sender"}</Text>
              ) : (
                <Text>{selectedChat.chatName ? selectedChat.chatName : "Group Chat"}</Text>
              )
            )}
          </View>
          <ScrollableChat className="messages" messages={messages} />
          {loading ? (
            <ActivityIndicator size="lg" color="blue" w={20}
              h={20}
              alignSelf="center"
              margin="auto" />
          ) : (
            <View style={styles.footer}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Type a message"
                  style={styles.input}
                  onChangeText={typingHandler}
                  value={newMessage}
                  onSubmitEditing={sendMessage}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                  <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {isTyping && <LottieView source={animationData} autoPlay loop style={{ width: 100, height: 100 }} />}
        </View>
      ) : (
        <Text>Select a chat to start messaging</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    margin: 5,
    width: "100%",
    height: "100%",
    paddingBottom: "3%",
    justifyContent: "space-between",
    backgroundColor: 'white',
    borderRadius: 8
  },
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footer: {
    width: "100%",
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1, 
    padding: 15,
    borderRadius: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#38B2AC',
    padding: 8,
    borderRadius: 50, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default SingleChat;