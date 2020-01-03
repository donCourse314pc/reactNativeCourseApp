import React, { Component } from 'react';

import {
  Image,
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  StatusBar,
  KeyboardAvoidingView,SafeAreaView,
  TouchableOpacity, StyleSheet,
  Platform
} from 'react-native';
import { Button } from 'react-native-elements';
import Meteor from 'react-native-meteor';

const navigationOptions = {
  header: null,
};


export default class LoginScreen extends Component {
  static navigationOptions = {
      header: null,
  };
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
    };
    this.toast = null;
    var self = this;
    if(Platform.OS != "ios"){
        StatusBar.setBackgroundColor('#fff');
        StatusBar.setBarStyle('dark-content');  
    }
  }
  
  clickFunction(){}


  ForgotPassword() {
    ////console.log('this', this);
    this.props.navigation.navigate('ForgotPassword');
  }

  onLoginPress() {
    ////console.log('presseeddd login');
    var email = this.state.username;
    const password = this.state.password;
    ////console.log("email",email);
    const self = this;
    if (email && password) {
      var email = email.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      var email = email.replace(/\s/g, '');
      ////console.log(email);
      if (!email || !password) {
        Alert.alert(
          'missing',
          'missing fields',
          [
            {
              text: 'OK', onPress: () => {this.clickFunction}
            },
          ],
        );
        return;
      }
      Meteor.loginWithPassword(email, password, (error, res) => {
        if (error) {
          Alert.alert(
            'invalid',
            'email or password invalid',
            [
              {
                text: 'OK', onPress: () => {this.clickFunction}
              },
            ],
          );
        } else {
          
          self.props.navigation.navigate('Main');
        }
      });
    } else {
      Alert.alert(
        'missing',
        'missing fields',
        [
          {
            text: 'OK', onPress: () => {this.clickFunction}
          },
        ],
      );
    }
  }

  SignUp(){
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
    <SafeAreaView  style={{flex:1, backgroundColor: '#ffffff'}} forceInset={{ top: 'never'}}>       
      <View style={styles.containerView} behavior="padding">

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>
              <Text style={styles.originallogoText}></Text>

              <TextInput
                placeholder="Username"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={username => this.setState({
                  username
                })}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.username}
                textContentType="none"
              />
              <TextInput
                placeholder="Password"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                secureTextEntry
                onChangeText={password => this.setState({
                  password
                })}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.password}
                textContentType="none"                
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={() => this.onLoginPress()}
                title="Login"
              />
              <Button
                buttonStyle={styles.fbLoginButton}
                onPress={() => this.SignUp()}
                title="Sign Up"
                titleStyle={{
                  color: '#1e90ff'
                }}
                type="clear"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>       
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      backgroundColor: '#33373B',
    },
    loginScreenContainer: {
        flex: 1,
    },
    loginFormView: {
        flex: 1
    },
    containerView: {
        flex: 1,
    },      
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 0,
        color:"#000",
        borderBottomWidth:1,
        borderColor: '#eaeaea',
        backgroundColor: 'transparent',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,
      },
      loginButton: {
        backgroundColor: '#1e90ff',
        borderRadius: 5,
        height: 45,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
      },
      registerButton: {
        height: 45,
        marginTop: 10,
        backgroundColor: 'transparent',
        marginLeft: 15,
        marginRight: 15,
      },   
      originallogoText: {
        fontSize: 32,
        fontWeight: '300',
        marginTop: 50,
        marginBottom: 30,
        textAlign: 'center',
        marginLeft: 15,
        marginRight: 15,
      },                 
  });
