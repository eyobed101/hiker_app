import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <TouchableOpacity style={styles.badge} onPress={handleFunction}>
      <Text style={styles.userName}>{user.username}</Text>
      {admin === user._id && <Text style={styles.adminText}> (Admin)</Text>}
      <Text style={styles.closeIcon}>✖️</Text> {/* Using a text symbol for close icon */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 4,
    backgroundColor: '#805AD5', // equivalent to Chakra's purple
  },
  userName: {
    fontSize: 12,
    color: '#fff',
  },
  adminText: {
    fontSize: 12,
    color: '#fff',
  },
  closeIcon: {
    marginLeft: 4,
    color: '#fff',
    fontSize: 16,
  },
});

export default UserBadgeItem;
