// import React from 'react'
// import { NavigationContainer } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import HomeScreen from '../screens/HomeScreen'
// import LoginScreen from '../screens/LoginScreen'
// import SignUpScreen from '../screens/SignUpScreen'
// import WelcomeScreen from '../screens/WelcomeScreen'
// import MyTabs from '../component/tab'
// import Description from '../component/Description'
// import ProfileUpdate from '../screens/ProfileUpdate'
// import ChatScreen from '../screens/ChatScreen'
// import Chatpage from '../screens/MessScreen'
// import ChatProvider from "../Context/ChatProvider"; // Import ChatProvider




// const Stack = createNativeStackNavigator();

// export default function Appnavigation() {
//   return (
//     <NavigationContainer>
//       <ChatProvider>

//         <Stack.Navigator initialRouteName='Welcome'>
//           <Stack.Screen name="Tabs" options={{ headerShown: false }} component={MyTabs} />
//           <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
//           <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
//           <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
//           <Stack.Screen name="Description" options={{ headerShown: false }} component={Description} />
//           <Stack.Screen name="ProfileUpdate" options={{ headerShown: false }} component={ProfileUpdate} />
//           <Stack.Screen name="ChatScreen" options={{ headerShown: false }} component={ChatScreen} />
//           <Stack.Screen name="MessScreen" options={{ headerShown: false }} component={Chatpage} />

//         </Stack.Navigator>
//       </ChatProvider>

//     </NavigationContainer>
//   )
// }


import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import MyTabs from '../component/tab'
import Description from '../component/Description'
import ProfileUpdate from '../screens/ProfileUpdate'
import ChatScreen from '../screens/ChatScreen'
import Chatpage from '../screens/MessScreen'
import ChatProvider from "../Context/ChatProvider"; // Import ChatProvider
import PostScreen from "../screens/PostScreen"; // Import ChatProvider
// import SplashScreen from '../screens/SplashScreen'




const Stack = createNativeStackNavigator();

export default function Appnavigation() {
  return (
    <NavigationContainer>
      <ChatProvider>

      <Stack.Navigator initialRouteName='Welcome'>       
         {/* <Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen} /> */}
         <Stack.Screen name="Plus" options={{ headerShown: false }} component={PostScreen} />

          <Stack.Screen name="Tabs" options={{ headerShown: false }} component={MyTabs} />
          <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
          <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
          <Stack.Screen name="Description" options={{ headerShown: false }} component={Description} />
          <Stack.Screen name="ProfileUpdate" options={{ headerShown: false }} component={ProfileUpdate} />
          <Stack.Screen name="ChatScreen" options={{ headerShown: false }} component={ChatScreen} />
          <Stack.Screen name="MessScreen" options={{ headerShown: false }} component={Chatpage} />

        </Stack.Navigator>
      </ChatProvider>

    </NavigationContainer>
  )
}
