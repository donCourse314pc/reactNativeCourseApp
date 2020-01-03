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


class DmItem extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        messageObject: null
      }
      this.goToDm = this.goToDm.bind(this)
      this.renderAvatar = this.renderAvatar.bind(this)
    }
    
    componentDidMount(){
      var self = this;
      this._mounted = true;
    }
    
    
    
    goToDm(){
     // console.log("this.props",this.props)
      var id, name, users;
      if(this.props.data && this.props.data){
        id = this.props.data._id;
        name = this.props.data.name;
      }      
      if(this.state.messageObject){
        users = this.state.messageObject.users
      }
      if(id){
        this.props.navigation.navigate('MessageScreen', {
          conversationId: id,
        });  
      }
    }
    
    renderAvatar(){
        var group, singleUser
        var userlist ;
        var user = Meteor.user();
        if(user && this.props.data && this.props.data.users && this.props.data.users[0] &&
            this.props.data.users[0].username != user.username){
          userlist = this.props.data.users[0];
               
        }else{
            userlist = this.props.data.users[1];   
        }
        console.log("userlist", userlist)
        return  <AvatarComp username={userlist} navigation={this.props.navigation}/>
    }
      
    render(){
      var FormatDate,avatar, body, trimmedString;
      var usrId = Meteor.userId();
      if(this.props && this.props.data && this.props.data.createdAt){
        FormatDate = formatDate(this.props.data.createdAt);
      }     

      var GroupMessage, length, user;
      var userlist = new Array();
      var user = Meteor.user();
      if(user && this.props.data && this.props.data.users && this.props.data.users[0] &&
          this.props.data.users[0].username != user.username){
        userlist.push(this.props.data.users[0]);
             
      }else{
          userlist.push(this.props.data.users[1]);   
      }
      return(
      <TouchableOpacity onPress={this.goToDm} >
          <Card transparent style={styles.cardStyleCommentReply} >
            <CardItem style={styles.cardItemStyleMain} >
                    <Left>
                      {this.renderAvatar()}
                      <Body style={{ alignSelf: 'flex-start',paddingLeft: 10 }}>
                        <View style={styles.nameContainer} >
                         <Text style={styles.nameTxt}>{userlist}</Text>
                          <Text style={styles.time}>{FormatDate}</Text>
                        </View>
                        <View style={styles.msgContainer}>
                          <Text style={styles.msgTxt}>{trimmedString}</Text>
                        </View>                    
                      </Body>
                    </Left>
              </CardItem>
          </Card>        
      </TouchableOpacity >);
    }
  }
  
  

export default class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps  }) => {
    return{
      title: 'Chat',
      headerStyle: { backgroundColor: '#1e90ff', elevation:1 },
      headerTitleStyle: { color: '#fff' },
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
      errorText: null, 
      conversations: null
    };    
  }

  componentDidMount(){
      var self = this;
      Meteor.call('getConversations', function(err, res){
          if(res){
              self.setState({
                conversations: res    
              })
          }
      })
  } 
  
    renderRow(record, index){
        if(record == null){
        return <View />
        }      
        return (<DmItem key={record._id} navigation={this.props.navigation} data={record} index={index}/>); 
    }
    renderFooter = () => {
    ////////console.log("footer", this.state.loading)
        if(this.state.loading != true) { return null; }
        return (
        <View style={styles.loadMoreHistorycontainer}>
            <ActivityIndicator size="large" color="rgb(29, 161, 242)" />
        </View>);
    }
    onEndReached = async (distanceFromEnd) => {

    }
    keyExtractor(item, index){
    //console.log("KEYYYYY", item)
    //console.log("INDDDEX", index)
    if(item){
        return item.key;
    }  
    }  
  
  render(){
    return(
      <SafeAreaView  style={{flex:1, backgroundColor: '#FFFFFF'}} forceInset={{ top: 'never'}}> 
        <View style={[styles.fill, {backgroundColor:"#ffffff"}]} behavior="padding" enabled   keyboardVerticalOffset={20}>
            <FlatList
                contentContainerStyle={styles.contentContainer}
                data={this.state.conversations}
                renderItem={({item, index}) => this.renderRow(item, index)}
                ListFooterComponent={this.renderFooter.bind(this)}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={.3}
                bounces={false}
                onMomentumScrollBegin={(event) => { 
                  this.onEndReachedCalledDuringMomentum = false; 
                }}
                keyExtractor={(item, index) => this.keyExtractor(item, index)}
            />
            <ActionButton buttonColor="#1e90ff">
              <ActionButton.Item buttonColor='#9b59b6' title="new message" onPress={() =>                           
                this.props.navigation.navigate('NewMessage',{   
                }) }>
                <MaterialCommunityIcons name="plus" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            </ActionButton>     
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
