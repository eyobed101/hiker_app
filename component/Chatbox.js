import React from "react";
import { View, StyleSheet } from "react-native";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <View
      style={[
        styles.container,
        {
          display: selectedChat ? "flex" : "none", // Handle visibility based on selectedChat
        },
      ]}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    padding: 12, // Adjusted padding
    backgroundColor: "white",
    width: "100%", // For base
    // maxWidth: "68%", // For md screens
    borderRadius: 8, // Adjusted border radius
    borderWidth: 1,
    borderColor: "#ccc",
    // You can add additional styles here if needed
  },
});

export default Chatbox;
