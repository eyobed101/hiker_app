// import React from "react";
// import { View, StyleSheet } from "react-native";
// import SingleChat from "./SingleChat";
// import { ChatState } from "../Context/ChatProvider";

// const Chatbox = ({ fetchAgain, setFetchAgain }) => {
//   const { selectedChat } = ChatState();

//   return (
//     <View
//       style={[
//         styles.container,
//         { display: selectedChat ? "flex" : "none" } 
//       ]}
//     >
//       <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     flexDirection: "column",
//     padding: 12,
//     backgroundColor: "white",
//     width: "100%", // This would be adjusted for smaller screens (base) or larger screens (md)
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
// });

// export default Chatbox;


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
// import { Button } from 'react-native-paper';
// import axiosInstance from '../config/axios';
// import { getSender } from '../config/ChatLogics';
// import ChatLoading from './ChatLoading';
// import GroupChatModal from './miscellaneous/GroupChatModal';
// import { ChatState } from '../Context/ChatProvider';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const MyChats = ({ fetchAgain }) => {
//   const [loggedUser, setLoggedUser] = useState();
//   const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

//   const fetchChats = async () => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axiosInstance.get('/chat', config);
//       console.log('here is the data', data);
//       setChats(data);
//     } catch (error) {
//       Alert.alert('Error Occurred!', 'Failed to Load the chats', error);
//     }
//   };

//   useEffect(() => {
//     const getUserInfo = async () => {
//       const userInfo = await AsyncStorage.getItem('userInfo');
//       if (userInfo) {
//         setLoggedUser(JSON.parse(userInfo));
//       }
//     };

//     getUserInfo();
//     fetchChats();
//     // eslint-disable-next-line
//   }, [fetchAgain]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>My Chats</Text>
//         <GroupChatModal>
//           <Button
//             style={styles.groupChatButton}
//           >
//             New Group Chat
//           </Button>
//         </GroupChatModal>
//       </View>
//       <View style={styles.chatContainer}>
//         {chats ? (
//           <ScrollView>
//             {chats.map((chat) => (
//               <TouchableOpacity
//                 key={chat._id}
//                 onPress={() => setSelectedChat(chat)}
//                 style={[
//                   styles.chatBox,
//                   { backgroundColor: selectedChat === chat ? '#38B2AC' : '#E8E8E8' },
//                 ]}
//               >
//                 <Text style={{ color: selectedChat === chat ? 'white' : 'black' }}>
//                   {!chat.isGroupChat
//                     ? getSender(loggedUser, chat.users)
//                     : chat.chatName}
//                 </Text>
//                 {chat.latestMessage ? (
//                   <Text style={styles.latestMessage}>
//                     <Text style={styles.bold}>
//                       {chat.latestMessage.sender.name}:
//                     </Text>
//                     {chat.latestMessage.content.length > 50
//                       ? `${chat.latestMessage.content.substring(0, 51)}...`
//                       : chat.latestMessage.content}
//                   </Text>
//                 ) : null}
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         ) : (
//           <ChatLoading />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   headerText: {
//     fontSize: 28,
//     fontFamily: 'Work Sans',
//   },
//   groupChatButton: {
//     fontSize: 17,
//   },
//   chatContainer: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   chatBox: {
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   latestMessage: {
//     fontSize: 12,
//     color: 'gray',
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
// });

// export default MyChats;



// import React from 'react';
// import { View, Text, StyleSheet, Image, Tooltip } from 'react-native';
// import { ChatState } from '../Context/ChatProvider';
// import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
// import { GiftedChat } from 'react-native-gifted-chat'; // Correct import for GiftedChat

// const ScrollableChat = ({ messages }) => {
//   const { user } = ChatState();

//   return (
//     <View style={{ flex: 1 }}> 
//       <GiftedChat 
//         messages={messages} 
//         renderMessage={(messageProps) => {
//           const { currentMessage } = messageProps;
//           return (
//             <View style={styles.messageContainer}>
//               {(isSameSender(messages, currentMessage, 0, user._id) || isLastMessage(messages, 0, user._id)) && (
//                 <Tooltip 
//                   popover={<Text>{currentMessage.sender.name}</Text>} 
//                   backgroundColor="black"
//                   padding={5}
//                   marginTop={5}
//                   marginLeft={5}
//                 >
//                   {currentMessage.sender.pic && (
//                     <Image
//                       source={{ uri: currentMessage.sender.pic }} 
//                       style={styles.avatar}
//                     />
//                   )}
//                 </Tooltip>
//               )}
//               <View
//                 style={[styles.messageBubble, {
//                   backgroundColor: currentMessage.sender._id === user._id ? '#BEE3F8' : '#B9F5D0',
//                   marginLeft: isSameSenderMargin(messages, currentMessage, 0, user._id),
//                   marginTop: isSameUser(messages, currentMessage, 0, user._id) ? 3 : 10,
//                 }]}
//               >
//                 <Text>{currentMessage.content}</Text>
//               </View>
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   messageContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginVertical: 2,
//   },
//   avatar: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     marginRight: 5,
//     marginTop: 7,
//   },
//   messageBubble: {
//     borderRadius: 20,
//     padding: 5,
//     paddingHorizontal: 15,
//     maxWidth: '75%',
//   },
// });

// export default ScrollableChat;




// import React, { useState, useEffect } from "react"; 
// import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
// import { getSender } from "../config/ChatLogics";
// import { ChatState } from "../Context/ChatProvider";
// import ScrollableChat from "./ScrollableChat";
// import LottieView from "lottie-react-native";
// import animationData from "../animations/typing";
// import io from "socket.io-client";
// import axiosInstance from '../config/axios';

// const ENDPOINT = "http://192.168.8.17:5000"; // Backend endpoint
// let socket, selectedChatCompare;

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newMessage, setNewMessage] = useState("");
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);

//   const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

//   const fetchMessages = async () => {
//     if (!selectedChat) return;

//     try {
//       setLoading(true);
//       const { data } = await axiosInstance.get(`/message/${selectedChat._id}`, {
//         headers: { Authorization: `Bearer ${user.token}` }
//       });
//       setMessages(data);
//       setLoading(false);
//       socket.emit("join chat", selectedChat._id);
//     } catch (error) {
//       alert("Error Occurred! Failed to load the messages.");
//       setLoading(false); // Ensure loading state is reset
//     }
//   };

//   const sendMessage = async () => {
//     if (newMessage) {
//       socket.emit("stop typing", selectedChat._id);
//       try {
//         const { data } = await axiosInstance.post("/message", {
//           content: newMessage,
//           chatId: selectedChat._id,
//         }, {
//           headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` }
//         });
//         setNewMessage("");
//         socket.emit("new message", data);
//         setMessages((prevMessages) => [...prevMessages, data]); // Use functional update
//       } catch (error) {
//         alert("Error Occurred! Failed to send the message.");
//       }
//     }
//   };

//   useEffect(() => {
//     socket = io(ENDPOINT);
//     socket.emit("setup", user);
//     socket.on("connected", () => setSocketConnected(true));
//     socket.on("typing", () => setIsTyping(true));
//     socket.on("stop typing", () => setIsTyping(false));

//     return () => {
//       socket.disconnect(); // Clean up the socket connection
//     };
//   }, []);

//   useEffect(() => {
//     fetchMessages();
//     selectedChatCompare = selectedChat;
//   }, [selectedChat]);

//   useEffect(() => {
//     socket.on("message received", (newMessageReceived) => {
//       if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
//         if (!notification.includes(newMessageReceived)) {
//           setNotification([newMessageReceived, ...notification]);
//           setFetchAgain(!fetchAgain);
//         }
//       } else {
//         setMessages((prevMessages) => [...prevMessages, newMessageReceived]); // Use functional update
//       }
//     });
//   }, [notification]);

//   const typingHandler = (text) => {
//     setNewMessage(text);
//     if (!socketConnected) return;

//     if (!typing) {
//       setTyping(true);
//       socket.emit("typing", selectedChat._id);
//     }

//     let lastTypingTime = new Date().getTime();
//     let timerLength = 3000;
//     setTimeout(() => {
//       let timeNow = new Date().getTime();
//       if (timeNow - lastTypingTime >= timerLength && typing) {
//         socket.emit("stop typing", selectedChat._id);
//         setTyping(false);
//       }
//     }, timerLength);
//   };

//   return (
//     <>
//       {selectedChat ? (
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => setSelectedChat(null)}>
//             </TouchableOpacity>
//             {messages && (
//               !selectedChat.isGroupChat ? (
//                 <Text>{getSender(user, selectedChat.users) || "Unknown Sender"}</Text>
//               ) : (
//                 <Text>{selectedChat.chatName ? selectedChat.chatName : "Group Chat"}</Text>
//               )
//             )}
//           </View>
//           <ScrollableChat messages={messages} />
//           {loading ? (
//             <ActivityIndicator size="lg" color="blue" />
//           ) : (
//             <View style={styles.footer}>
//               <TextInput
//                 placeholder="Type a message"
//                 style={styles.input}
//                 onChangeText={typingHandler}
//                 value={newMessage}
//                 onSubmitEditing={sendMessage} 
//               />
//               <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
//                 <Text>Send</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//           {isTyping && <LottieView source={animationData} autoPlay loop style={{ width: 100, height: 100 }} />}
//         </View>
//       ) : (
//         <Text>Select a chat to start messaging</Text>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: 'white',
//     borderRadius: 8,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     padding: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginRight: 8,
//   },
//   sendButton: {
//     backgroundColor: '#38B2AC',
//     padding: 10,
//     borderRadius: 8,
//   },
// });

// export default SingleChat;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   TextInput,
//   Alert,
//   FlatList,
// } from 'react-native';
// import { useToast } from 'react-native-toast-notifications';
// import axios from 'axios';
// import { Avatar } from 'react-native-elements';
// import { useNavigation } from '@react-navigation/native';
// import ChatLoading from '../ChatLoading';
// import UserListItem from '../userAvatar/UserListItem';
// import { ChatState } from '../../Context/ChatProvider';
// import axiosInstance from '../../config/axios';
// // import NotificationBadge from 'react-native-notification-badge';

// const SideDrawer = () => {
//   const [search, setSearch] = useState('');
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingChat, setLoadingChat] = useState(false);
//   const [isModalVisible, setModalVisible] = useState(false);

//   const {
//     setSelectedChat,
//     user,
//     notification,
//     setNotification,
//     chats,
//     setChats,
//   } = ChatState();

//   const toast = useToast();
//   const navigation = useNavigation();

//   const logoutHandler = () => {
//     // Your logout logic here
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       { text: "OK", onPress: () => navigation.navigate('Home') }, // Change 'Home' to your route
//     ]);
//   };

//   const handleSearch = async () => {
//     if (!search) {
//       toast.show("Please Enter something in search", {
//         type: "warning",
//         placement: "top",
//         duration: 5000,
//       });
//       return;
//     }

//     try {
//       setLoading(true);

//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axiosInstance.get(`/auth/user?search=${search}`, config);

//       setLoading(false);
//       setSearchResult(data);
//     } catch (error) {
//       toast.show("Error Occurred! Failed to Load the Search Results", {
//         type: "danger",
//         placement: "bottom",
//         duration: 5000,
//       });
//     }
//   };

//   const accessChat = async (userId) => {
//     try {
//       setLoadingChat(true);
//       const config = {
//         headers: {
//           'Content-type': 'application/json',
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axiosInstance.post(`/chat`, { userId }, config);

//       if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
//       setSelectedChat(data);
//       setLoadingChat(false);
//       setModalVisible(false);
//     } catch (error) {
//       toast.show("Error fetching the chat", {
//         type: "danger",
//         placement: "bottom",
//         duration: 5000,
//       });
//     }
//   };

//   return (
//     <>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.searchButton}>
//           <Text style={styles.buttonText}>Search User</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>Talk-A-Tive</Text>
//         <View style={styles.notificationContainer}>
//           {/* <NotificationBadge
//             count={notification.length}
//             style={styles.notificationBadge}
//           /> */}
//           <TouchableOpacity onPress={logoutHandler}>
//             <Avatar
//               size="small"
//               rounded
//               source={{ uri: user.pic }}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Modal for Search Users */}
//       <Modal
//         animationType="slide"
//         transparent={false}
//         visible={isModalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalHeader}>Search Users</Text>
//           <View style={styles.searchInputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Search by name or email"
//               value={search}
//               onChangeText={setSearch}
//             />
//             <TouchableOpacity onPress={handleSearch} style={styles.goButton}>
//               <Text style={styles.buttonText}>Go</Text>
//             </TouchableOpacity>
//           </View>
//           {loading ? (
//             <ChatLoading />
//           ) : (
//             <FlatList
//               data={searchResult}
//               renderItem={({ item }) => (
//                 <UserListItem
//                   key={item._id}
//                   user={item}
//                   handleFunction={() => accessChat(item._id)}
//                 />
//               )}
//               keyExtractor={item => item._id}
//             />
//           )}
//           {loadingChat && <Text style={styles.loadingText}>Loading...</Text>}
//           <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
//             <Text style={styles.buttonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     width: '100%',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   searchButton: {
//     padding: 10,
//     backgroundColor: '#E8E8E8',
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'black',
//   },
//   title: {
//     fontSize: 24,
//     fontFamily: 'Work Sans',
//   },
//   notificationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   notificationBadge: {
//     marginRight: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: 'white',
//   },
//   modalHeader: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//   },
//   goButton: {
//     padding: 10,
//     backgroundColor: '#38B2AC',
//     borderRadius: 5,
//   },
//   loadingText: {
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   closeButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#E8E8E8',
//     borderRadius: 5,
//   },
// });

// export default SideDrawer;
