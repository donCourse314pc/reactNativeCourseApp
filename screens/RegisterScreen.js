import React, { Component } from 'react';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,StatusBar,
  ActivityIndicator, SafeAreaView, StyleSheet
} from 'react-native';
import { Button } from 'react-native-elements';
import { Accounts } from 'react-native-meteor';
import Meteor from 'react-native-meteor';

const navigationOptions = {
  header: null,
};

export default class RegisterScreen extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
      super(props);

      this.state = {
        email: null,
        username: null,
        password: null,
        loadings: null,
      };
        StatusBar.setBackgroundColor('#fff');
        StatusBar.setBarStyle('dark-content');   
        this.Register = this.Register.bind(this)    
    }

    Login() {
      this.props.navigation.navigate('Auth');
    }

    
    clickFunction(){}

    Register() {
      //console.log('register');
      let email = this.state.email;
      let username = this.state.username;
      const password = this.state.password;
      ////console.log("email",email);
      var self = this;
      if (email && password && username) {
        email = email.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        email = email.replace(/\s/g, '');

        username = username.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        username = username.replace(/\s/g, '');
        ////console.log(email);
        if (!email || !password || !username) {
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
        this.setState({
          loadings: true
        });
        Meteor.call('registerUser', email, username, password, (error, result) => {
          if (error) {
            // eslint-disable-next-line eqeqeq
            console.log("error", error)
            self.setState({
              loadings: null
            });
            if (error.error !== 500) {
              Alert.alert(
                'username or emailadress may be taken',
                error.message,
                [
                  {
                    text: 'OK', onPress: () => {this.clickFunction}
                  },
                ],
              );
            }
          } else {
            const userId = result;

            Meteor.loginWithPassword(username, password, (err, result) => {
              if (!err) {
                self.props.navigation.navigate('Main', {
                  username: username
                });
              }else{
                self.setState({
                  loadings: null
                });
              }
            });
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

    render() {
      if (this.state.loadings === true) {
        return (
          <SafeAreaView  style={{flex:1, backgroundColor: '#FFFFFF'}} forceInset={{ top: 'never'}}> 
          <View style={styles.containerView} behavior="padding">

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.loginScreenContainer}>
                <View style={styles.loginFormView}>
                  <Text style={styles.loading}>loading ..</Text>
                  <ActivityIndicator size="large" color="#1e90ff" />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </SafeAreaView >           
        );
      }
      return (
      <SafeAreaView  style={{flex:1, backgroundColor: '#FFFFFF'}} forceInset={{ top: 'never'}}> 
        <View style={styles.containerView} behavior="padding">

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginScreenContainer}>
              <View style={styles.loginFormView}>
                <Text style={styles.originallogoText} />

                <TextInput
                  placeholder="email"
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput}
                  onChangeText={email => this.setState({
                    email
                  })}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={this.state.email}
                />
                <TextInput
                  placeholder="username"
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput}
                  onChangeText={username => this.setState({
                    username
                  })}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={this.state.username}
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
                />
                <Button
                  buttonStyle={styles.loginButton}
                  onPress={() => this.Register()}
                  title="Register"
                />
                <Button
                  buttonStyle={styles.fbLoginButton}
                  onPress={() => this.Login()}
                  title="Login"
                  titleStyle={{
                    color: '#333333'
                  }}
                  type="clear"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        </SafeAreaView >          
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
