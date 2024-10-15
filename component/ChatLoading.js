import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const ChatLoading = () => {
  return (
    <View style={styles.container}>
      {Array.from({ length: 12 }).map((_, index) => (
        <ActivityIndicator key={index} animating={true} size="large" style={styles.loading} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  loading: {
    marginBottom: 15, // Add margin for spacing
  },
});

export default ChatLoading;
