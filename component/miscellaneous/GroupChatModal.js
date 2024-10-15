import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useToast } from "react-native-toast-notifications"; // Assuming you're using a toast library
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const { user, chats, setChats } = ChatState();
  const toast = useToast();
  
  const [isVisible, setIsVisible] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.show("User already added", { type: "warning" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.show("Failed to Load the Search Results", { type: "error" });
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.show("Please fill all the fields", { type: "warning" });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsVisible(false);
      toast.show("New Group Chat Created!", { type: "success" });
    } catch (error) {
      toast.show("Failed to Create the Chat!", { type: "error" });
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setIsVisible(true)}>
        {children}
      </TouchableWithoutFeedback>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={{ backgroundColor: "white", borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Create Group Chat</Text>

            <TextInput
              placeholder="Chat Name"
              value={groupChatName}
              onChangeText={setGroupChatName}
              style={{ borderWidth: 1, borderColor: "#ccc", marginVertical: 10, padding: 10, borderRadius: 5 }}
            />
            <TextInput
              placeholder="Add Users eg: John, Piyush, Jane"
              value={search}
              onChangeText={handleSearch}
              style={{ borderWidth: 1, borderColor: "#ccc", marginVertical: 10, padding: 10, borderRadius: 5 }}
            />

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </View>

            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              searchResult.slice(0, 4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}

            <Button title="Create Chat" onPress={handleSubmit} color="#007bff" />
            <Button title="Cancel" onPress={() => setIsVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GroupChatModal;
