import React from 'react';
import { Modal, View, Text, Image, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importing icons from Expo

const ProfileModal = ({ user, children }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      {children ? (
        <TouchableOpacity onPress={openModal}>{children}</TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={openModal}>
          <Ionicons name="eye" size={24} color="black" /> {/* Use any icon here */}
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>{user.name}</Text>
            <Button title="Close" onPress={closeModal} />
            <View style={styles.body}>
              {/* <Image
                style={styles.image}
                source={{ uri: user.pic }}
                accessibilityLabel={user.name}
              /> */}
              <Text style={styles.email}>Email: {user.email}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = {
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
    fontFamily: 'Work Sans', // Ensure this font is available in your app
    textAlign: 'center',
  },
  body: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  image: {
    borderRadius: 75,
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  email: {
    fontSize: 28,
    fontFamily: 'Work Sans', // Ensure this font is available in your app
  },
};

export default ProfileModal;
