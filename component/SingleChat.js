import React, { useState, useEffect } from "react"; 
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ScrollableChat from "./ScrollableChat";
import LottieView from "lottie-react-native";
import animationData from "../animations/typing";
import io from "socket.io-client";
import axiosInstance from '../config/axios';

const ENDPOINT = "http://192.168.8.17:5000"; // Backend endpoint
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
      const { data } = await axiosInstance.get(`/message/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Error Occurred! Failed to load the messages.");
      setLoading(false); // Ensure loading state is reset
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedChat(null)}>
            </TouchableOpacity>
            {messages && (
              !selectedChat.isGroupChat ? (
                <Text>{getSender(user, selectedChat.users) || "Unknown Sender"}</Text>
              ) : (
                <Text>{selectedChat.chatName ? selectedChat.chatName : "Group Chat"}</Text>
              )
            )}
          </View>
          <ScrollableChat messages={messages} />
          {loading ? (
            <ActivityIndicator size="lg" color="blue" />
          ) : (
            <View style={styles.footer}>
              <TextInput
                placeholder="Type a message"
                style={styles.input}
                onChangeText={typingHandler}
                value={newMessage}
                onSubmitEditing={sendMessage} 
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text>Send</Text>
              </TouchableOpacity>
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
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#38B2AC',
    padding: 10,
    borderRadius: 8,
  },
});

export default SingleChat;
