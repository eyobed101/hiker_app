import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
// import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import LottieView from "lottie-react-native";
import animationData from "../animations/typing";
import io from "socket.io-client";
import axiosInstance from '../config/axios';
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

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

  const sendMessage = async (event) => {
    if (event.nativeEvent.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const { data } = await axiosInstance.post("/message", {
          content: newMessage,
          chatId: selectedChat._id, // Correctly passing the chatId
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
  }, [notification]); // Add notification to dependency array

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
              {/* <Icon name="arrow-back" size={24} /> */}
            </TouchableOpacity>
            {messages && (
              !selectedChat.isGroupChat ? (
                <>
                  <Text>{getSender(user, selectedChat.users) || "Unknown Sender"}</Text>
                  {/* <ProfileModal user={getSenderFull(user, selectedChat.users)} /> */}
                </>
              ) : (
                <>
                  <Text>{selectedChat.chatName ? selectedChat.chatName.toUpperCase() : "Unnamed Group"}</Text>
                  <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </>
              )
            )}
          </View>
          <View style={styles.messagesContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <ScrollableChat messages={messages} />
            )}
          </View>
          {isTyping && (
            <LottieView source={animationData} autoPlay loop style={styles.typingIndicator} />
          )}
          <TextInput
            style={styles.input}
            placeholder="Enter a message..."
            value={newMessage}
            onChangeText={typingHandler}
            onSubmitEditing={sendMessage}
          />
        </View>
      ) : (
        <View style={styles.centered}>
          <Text>Click on a user to start chatting</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    margin: 10,
  },
  typingIndicator: {
    width: 70,
    height: 50,
    marginBottom: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SingleChat;
