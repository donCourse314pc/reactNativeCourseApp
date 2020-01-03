import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  ListView, FlatList,
  StatusBar,
  TouchableOpacity,
  Animated,
  View, SafeAreaView,
  AsyncStorage, Modal
} from 'react-native';
//import { WebBrowser } from 'expo';
import Constants from 'expo-constants'
import { MonoText } from '../components/StyledText';
import Meteor, { withTracker } from 'react-native-meteor';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { DrawerActions, NavigationActions } from 'react-navigation'
//import { Appbar, DefaultTheme } from 'react-native-paper';
import {HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import { Button, ButtonGroup } from 'react-native-elements';
//import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import { Icon } from "react-native-elements";
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
import _ from 'lodash';

const navigationOptions = {
  header: null,
};



const EntypoHeaderButton = props => (
  // the `props` here come from <Item .../>
  // you may access them and pass something else to `HeaderButton` if you like
 <HeaderButton {...props} IconComponent={props.MyIconComponent} iconSize={26} color="#fff" />
);
const IoniconsHeaderButton = props => (
  // the `props` here come from <Item .../>
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton {...props} IconComponent={props.MyIconComponent} iconSize={26} color="#fff" />
);

import t from 'tcomb-form-native';
const Form = t.form.Form;

// clone the default stylesheet
const stylesheetz = _.cloneDeep(t.form.Form.stylesheet);

// overriding the text color
stylesheetz.textbox.normal.color = '#7C4DFF';

////console.log('Form', Form);
const Post = t.struct({
  body: t.String,
});
var options = {
  fields: {
    body: {
      label: 'description here...',
      multiline: true,
      stylesheet: {
        ...Form.stylesheet,
        textbox: {
          ...Form.stylesheet.textbox,
          normal: {
            ...Form.stylesheet.textbox.normal,
            height: 180,
            textAlignVertical: 'top',
            marginLeft: 15,
            marginRight: 15,
            borderColor: '#eee',
          },
          error: {
            ...Form.stylesheet.textbox.error,
            height: 100,
          },
        },
        controlLabel: {
          normal: {
            color: '#565656',
            marginLeft: 15,
            marginBottom: 15
          },
        }
       
      },
    },
  }
};

export default class AddPostScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps  }) => {
    return{
      title: 'Add Post',
      headerStyle: { backgroundColor: '#1e90ff', elevation:1 },
      headerTitleStyle: { color: '#fff' },
      headerLeft: (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item MyIconComponent={MaterialCommunityIcons} title="search" iconName="arrow-left-thick" onPress={() => navigation.goBack()} />
        </HeaderButtons>
      ),
      tabBarVisible: false,
    };
  };
  constructor(props){
    super(props);
    StatusBar.setBackgroundColor('#1e90ff');
    StatusBar.setBarStyle('light-content');    
    this.state = {
      open: false,
      postType: null,
      visibleModal: false,
      text: null,
      imageUri: null,
      imageSignature:null,
      errorText: null
    };    
    this.submitPost = this.submitPost.bind(this)
  }

  componentDidMount(){
  } 
  

  submitPost = async () =>  {
    var postObject = this._form.getValue();
    if(postObject){
      var self = this;
      Meteor.call('createNewPost',postObject.body,function(err,result){
        if(!err){
          self.props.navigation.state.params.reload();
          self.props.navigation.goBack()
        }
      })
    }
  }  
  
  
  render(){
    return(
      <SafeAreaView  style={{flex:1, backgroundColor: '#FFFFFF'}} forceInset={{ top: 'never'}}> 
        <KeyboardAwareScrollView style={[styles.fill, {backgroundColor:"#ffffff"}]} behavior="padding" enabled   keyboardVerticalOffset={20}>
          <View style={{paddingTop: 20}}>
            <Form
                ref={c => this._form = c}
                type={Post}
                options={options}
            />        
            
            <View style={styles.modalFooter}>
              <Button buttonStyle={styles.fbLoginButton} 
                onPress={this.submitPost.bind(this)} 
                size={24}
                title="Save"
                titleStyle={{
                  color: '#ffffff'
                }}
                type="clear"
              />   
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
  
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 120
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: '#1e90ff',
    marginLeft: 15,
    marginRight: 15,
    width: 200,
  },
  modalFooter:{
    backgroundColor: "white",
    height: 54,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    borderTopColor: '#eeeeee',
    bottom: 0,  
    borderWidth: 0,    
  },
  modaHeaderCloseButton:{
    color: "#000000",
    fontSize:28,
  },
  modalImageButton:{
    color: "#000000",
    fontSize:36,
  },
  loadMoreHistorycontainer: {
    flex: 1,
    justifyContent: 'center',
    padding:10,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  fill: {
    flex: 1,
  },
  navbar: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#2D99F1',
    borderBottomColor: '#dedede',
    borderBottomWidth: 0,
    height: 64,
    justifyContent: "flex-start",
    elevation:8,
    flex: 1, flexDirection: 'row'
    //paddingTop: STATUS_BAR_HEIGHT,
  },
  contentContainer: {
    paddingTop: 0,
    marginLeft:0,
    marginRight:0,
    backgroundColor: '#ffffff',
    paddingBottom:0,
    //paddingBottom:40,
    top: -5,
  },
  title: {
    color: '#FFF',
    fontWeight:"bold",
  },
  row: {
    height: 300,
    width: null,
    marginBottom: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  rowText: {
    color: 'white',
    fontSize: 18,
  },
  avatar:{
    marginRight:15
  },
  buttonPost:{
    backgroundColor:'#1e90ff',
  },
  modal: {
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
  }  
});
