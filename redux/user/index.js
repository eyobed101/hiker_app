import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define an async thunk for user login
const loginUser = createAsyncThunk("user/loginUser", async (data) => {
  try {
    const response = await axiosInstance.post('auth/login', {
      email: data.email,
      password: data.password
    });

    const responseData = {
      token: response.data.token,
      refreshToken: response.data.refreshToken,
      email: data.email,
      username : response.data.username
    };

    await AsyncStorage.setItem('token', response.data.token); 
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    await AsyncStorage.setItem('email', data.email); 
    await AsyncStorage.setItem('password', data.password); 
    await AsyncStorage.setItem('password', response.data.username); 


    return responseData;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});


const emailRegistered = createAsyncThunk("user/register", async (data) => {
  try {
    console.log("best" , data)
    const response = await axiosInstance.post('/auth/org/register', {
      username: data.username,
      email: data.email,
      password: data.password
    });
    
    console.log("test",response)
    const responseData = {
      username: data.username,
      email: data.email,
      password: data.password
    };

    return responseData; // Return structured data
  } catch (error) {
    throw new Error(error.response.data.message); // Correct error message extraction
  }
});

// Define a slice for user data management
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: false,
    value: null,
    username :null,
    email :null,
    password :null,
    token: null,
    refreshToken :null,
  },
  reducers: {
    logout: (state) => {
      state.value = null;
      state.token = null;
      state.username = null;
      //state.expiration = null;
      state.email =null;
      state.password =null;
      state.token =null;
      state.refreshToken =null;
      state.error = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.value = action.payload.token;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.refreshToken = action.payload.refreshToken;
      state.error = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const userLogin = loginUser;
export const emailLogin = emailRegistered;
export const userAction = userSlice.actions;
function transformString(input) {
  const parts = input.split('x0X');

  const prefix = parts[0]; 

  const middlePartRaw = parts[1].substring(1); 
  let middle = parseInt(middlePartRaw, 10); 
  middle = middle.toString().padStart(4, '0'); 

  const lastPartRaw = parts[2].substring(1); 
  const last = parseInt(lastPartRaw, 10).toString().padStart(2, '0'); 

  return `${prefix}/${middle}/${last}`;
}


export default userSlice.reducer;