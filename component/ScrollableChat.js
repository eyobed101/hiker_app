import React from 'react';
import { View, Text, StyleSheet, Image, Tooltip } from 'react-native';
import { ChatState } from '../Context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { GiftedChat } from 'react-native-gifted-chat'; // Correct import for GiftedChat

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <View style={{ flex: 1 }}> {/* Added container for proper layout */}
      <GiftedChat 
        messages={messages} 
        renderMessage={(messageProps) => {
          const { currentMessage } = messageProps;
          return (
            <View style={styles.messageContainer}>
              {(isSameSender(messages, currentMessage, 0, user._id) || isLastMessage(messages, 0, user._id)) && (
                <Tooltip 
                  popover={<Text>{currentMessage.sender.name}</Text>} 
                  backgroundColor="black"
                  padding={5}
                  marginTop={5}
                  marginLeft={5}
                >
                  {/* <Image
                    source={{ uri: currentMessage.sender.pic }}
                    style={styles.avatar}
                  /> */}
                </Tooltip>
              )}
              <View
                style={[styles.messageBubble, {
                  backgroundColor: currentMessage.sender._id === user._id ? '#BEE3F8' : '#B9F5D0',
                  marginLeft: isSameSenderMargin(messages, currentMessage, 0, user._id),
                  marginTop: isSameUser(messages, currentMessage, 0, user._id) ? 3 : 10,
                }]}
              >
                <Text>{currentMessage.content}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    marginTop: 7,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 15,
    maxWidth: '75%',
  },
});

export default ScrollableChat;
