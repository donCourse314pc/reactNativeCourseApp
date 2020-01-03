import React, { Fragment } from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import Meteor from 'react-native-meteor';
import { 
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View, AsyncStorage 
} from 'react-native';
export class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }
  _bootstrapAsync = async () => {
    const token = await AsyncStorage.getItem('reactnativemeteor_usertoken');
    var self = this;
    if(token){
      Meteor._loginWithToken(token,function(err, result){
        if(!err){
          self.props.navigation.navigate('Main');  
        }else{
          self.props.navigation.navigate('Auth'); 
        }
      })
    }else{
      this.props.navigation.navigate('Auth');
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00B0FF" />
      </View>
    );
  }
}

export const LoggedIn = createStackNavigator({
  Auth: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: {
      screen: AuthLoadingScreen,
    },
    Main: {
      screen: MainTabNavigator,
    },
    Auth: {
      screen: LoggedIn
    },

  },
  {
    initialRouteName: 'AuthLoading',
  }
));


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});