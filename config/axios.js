import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  // baseURL: 'http://192.168.137.234:5000/api/v1.0/',
  baseURL: 'https://hikeapi.issipeteta.net/api/v1.0/',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Ensure the token key matches what you use
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
