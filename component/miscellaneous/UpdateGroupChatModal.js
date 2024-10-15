import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain, isVisible, onClose }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Error Occurred! Failed to Load the Search Results");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      alert(`Error Occurred! ${error.response.data.message}`);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      alert(`Error Occurred! ${error.response.data.message}`);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      alert(`Error Occurred! ${error.response.data.message}`);
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          {selectedChat.chatName}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
          <TextInput
            placeholder="Chat Name"
            value={groupChatName}
            onChangeText={setGroupChatName}
            style={{ flex: 1, borderColor: "#ccc", borderWidth: 1, padding: 10, marginRight: 10 }}
          />
          <Button title={renameLoading ? "Updating..." : "Update"} onPress={handleRename} disabled={renameLoading} />
        </View>

        <TextInput
          placeholder="Add User to group"
          onChangeText={handleSearch}
          style={{ borderColor: "#ccc", borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={searchResult}
            renderItem={({ item }) => (
              <UserListItem user={item} handleFunction={() => handleAddUser(item)} />
            )}
            keyExtractor={(item) => item._id}
          />
        )}

        <View style={{ marginTop: 20 }}>
          {selectedChat.users.map((u) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              admin={selectedChat.groupAdmin}
              handleFunction={() => handleRemove(u)}
            />
          ))}
        </View>

        <Button title="Leave Group" color="red" onPress={() => handleRemove(user)} />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default UpdateGroupChatModal;
