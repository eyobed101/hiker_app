import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {HomeIcon , UserIcon , PlusIcon , InboxIcon} from 'react-native-heroicons/solid'
import HomeScreen from '../screens/HomeScreen';
// import PostScreen from '../screens/PostScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessScreen from '../screens/MessScreen';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();
export default function MyTabs() {
  return (
    <Tab.Navigator 
    screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.bgColor,
          borderTopWidth: 0,
          padding: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primaryColor,
        tabBarInactiveTintColor: "#999",
        headerShown: false
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}  
       options={{
        tabBarIcon: ({ color }) => (
          <HomeIcon size={20} color={color} />
        ),
      }}
      />
      {/* <Tab.Screen name="Plus" component={PostScreen}
      options={{
        tabBarIcon: ({ color }) => (
            <PlusIcon size={20} color={color} />
        ),
      }}
      /> */}
        <Tab.Screen name="Inbox" component={InboxScreen}
      options={{
        tabBarIcon: ({ color }) => (
            <InboxIcon size={20} color={color} />
        ),
      }}
      />
        <Tab.Screen name="Chat" component={MessScreen}
      options={{
        tabBarIcon: ({ color }) => (
            <InboxIcon size={20} color={color} />
        ),
      }}
      />
        <Tab.Screen name="Profile" component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => (
            <UserIcon size={20} color={color} />
        ),
      }}
      />
    </Tab.Navigator>
  );
}