import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import { ChatState } from '../../Context/ChatProvider';
import axiosInstance from '../../config/axios';
// import NotificationBadge from 'react-native-notification-badge';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const navigation = useNavigation();

  const logoutHandler = () => {
    // Your logout logic here
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => navigation.navigate('Home') }, // Change 'Home' to your route
    ]);
  };

  const handleSearch = async () => {
    if (!search) {
      toast.show("Please Enter something in search", {
        type: "warning",
        placement: "top",
        duration: 5000,
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axiosInstance.get(`/auth/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.show("Error Occurred! Failed to Load the Search Results", {
        type: "danger",
        placement: "bottom",
        duration: 5000,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosInstance.post(`/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setModalVisible(false);
    } catch (error) {
      toast.show("Error fetching the chat", {
        type: "danger",
        placement: "bottom",
        duration: 5000,
      });
    }
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.searchButton}>
          <Text style={styles.buttonText}>Search User</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Talk-A-Tive</Text>
        <View style={styles.notificationContainer}>
          {/* <NotificationBadge
            count={notification.length}
            style={styles.notificationBadge}
          /> */}
          <TouchableOpacity onPress={logoutHandler}>
            <Avatar
              size="small"
              rounded
              source={{ uri: user.pic }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Search Users */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Search Users</Text>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search by name or email"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.goButton}>
              <Text style={styles.buttonText}>Go</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ChatLoading />
          ) : (
            <FlatList
              data={searchResult}
              renderItem={({ item }) => (
                <UserListItem
                  key={item._id}
                  user={item}
                  handleFunction={() => accessChat(item._id)}
                />
              )}
              keyExtractor={item => item._id}
            />
          )}
          {loadingChat && <Text style={styles.loadingText}>Loading...</Text>}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#E8E8E8',
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Work Sans',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  goButton: {
    padding: 10,
    backgroundColor: '#38B2AC',
    borderRadius: 5,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E8E8E8',
    borderRadius: 5,
  },
});

export default SideDrawer;
