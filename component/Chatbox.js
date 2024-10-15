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
        { display: selectedChat ? "flex" : "none" } // Handle visibility based on selectedChat
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
    padding: 12,
    backgroundColor: "white",
    width: "100%", // This would be adjusted for smaller screens (base) or larger screens (md)
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default Chatbox;
