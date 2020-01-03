import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, Fragment } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import connect from './connect';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaView } from 'react-navigation';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

if(Platform.OS === 'android')
{
  SafeAreaView.setStatusBarHeight(0)
}
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isLoadingComplete: false,
  };
  componentDidMount() {
    connect();
  }



  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...AntDesign.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({
      isLoadingComplete: true
    });
  };
  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    return (
        <Fragment>
            <View style={styles.container}>
              <AppNavigator />
            </View>
        </Fragment>
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
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor:'#79B45D',
    height: APPBAR_HEIGHT,
  },  
});
