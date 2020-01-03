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
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DrawerActions, NavigationActions } from 'react-navigation'
//import { Appbar, DefaultTheme } from 'react-native-paper';
import {HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import { Button, ButtonGroup } from 'react-native-elements';
//import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AvatarComp from '../components/avatar'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import { Icon } from "react-native-elements";
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
const navigationOptions = {
  header: null,
};
import { CardItem, Card, Left, Thumbnail, Body, Right, RefreshControl, List, ListItem } from 'native-base';
import MessageComp from '../components/MessageComp'

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
import moment from 'moment';
import t from 'tcomb-form-native';
const Form = t.form.Form;
var formatDate = function (date) {
    if (!date) return;
    if(date != null){
      ////console.log("date",date)
      var date = new Date(date);
      ////console.log("new date")
      var then = date.getTime();
      var now  = new Date().getTime();
      var weekInMilliseconds = 604800000;
    
      if (now - then > weekInMilliseconds) {
        return moment(date).format('D MMM YYYY');
      }
      return moment(date).fromNow();
    }
  };
// clone the default stylesheet
const stylesheetz = _.cloneDeep(t.form.Form.stylesheet);

// overriding the text color
stylesheetz.textbox.normal.color = '#7C4DFF';

  

export default class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps  }) => {
    return{
      title: 'Messages',
      headerStyle: { backgroundColor: '#1e90ff', elevation:1 },
      headerTitleStyle: { color: '#fff' },
      tabBarVisible: false,
      headerLeft: (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item MyIconComponent={MaterialCommunityIcons} title="search" iconName="arrow-left-thick" onPress={() => navigation.goBack()} />
        </HeaderButtons>
      ),     
    };
  };
  constructor(props){
    super(props);
    StatusBar.setBackgroundColor('#1e90ff');
    StatusBar.setBarStyle('light-content');    
    this.state = {loaded: null, ListCount: 150,} 
    this.increaseParentCount = this.increaseParentCount.bind(this)
  }

  increaseParentCount(){
    //console.log("increaseParentCount")
    var count = this.state.ListCount;
    count = count + 20;
    this.setState({
      ListCount: count  
    })
}
    keyExtractor(item, index){
    //console.log("KEYYYYY", item)
    //console.log("INDDDEX", index)
    if(item){
            return item.key;
        }  
    }  
  
  render(){
    var conversationId = this.props.navigation.getParam('conversationId', 'null');
    return(
      <SafeAreaView  style={{flex:1, backgroundColor: '#FFFFFF'}} forceInset={{ top: 'never'}}> 
        <View style={[styles.fill, {backgroundColor:"#ffffff"}]} behavior="padding" enabled   keyboardVerticalOffset={20}>
            <MessageComp conversationId={conversationId} increaseParentCount={this.increaseParentCount} />     
        </View>
      </SafeAreaView>
    );
  }
  
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
      },  
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
      },    
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
