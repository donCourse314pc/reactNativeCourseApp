import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddPostScreen from '../screens/AddPostScreen'
import Profile from '../screens/Profile'
import ChatScreen from '../screens/ChatScreen'
import NewMessage from '../screens/NewMessage'
import MessageScreen from '../screens/MessageScreen'
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    AddPost:{
      screen: AddPostScreen
    }
  },
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'home'}
    />
  ),
};

HomeStack.path = '';

const ChatStack = createStackNavigator(
  {
    Chat: ChatScreen,
    NewMessage: {
      screen: NewMessage
    },
    MessageScreen:{
      screen: MessageScreen
    }
  },
);

ChatStack.navigationOptions = ({navigation}) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (routeName == 'MessageScreen') {
    navigationOptions = {
      tabBarVisible: false
    }
  }else{
    navigationOptions = {
      tabBarLabel: 'Chat',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={'inbox'} />
      ),   
    }
  }
  return navigationOptions;
}


ChatStack.path = '';

const UserProfile = createStackNavigator(
  {
    Profile: Profile,
  },
);

UserProfile.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'user'} />
  ),
};

UserProfile.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  ChatStack,
  UserProfile,
});

tabNavigator.path = '';

export default tabNavigator;
