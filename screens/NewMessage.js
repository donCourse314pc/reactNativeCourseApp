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
  View, SafeAreaView, TextInput,
  AsyncStorage, Modal
} from 'react-native';
//import { WebBrowser } from 'expo';
import Constants from 'expo-constants'
import { MonoText } from '../components/StyledText';
import Meteor, { withTracker } from 'react-native-meteor';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { DrawerActions, NavigationActions } from 'react-navigation'
//import { Appbar, DefaultTheme } from 'react-native-paper';
import {HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import { Button, ButtonGroup } from 'react-native-elements';
//import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AvatarComp from '../components/avatar'
import { CardItem, Card, Left, Thumbnail, Body, Right, RefreshControl, List, ListItem } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import { Icon } from "react-native-elements";
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
import _ from 'lodash';

const navigationOptions = {
  header: null,
};

const primaryColor = "#1abc9c";
const height = '95%';
const darkGrey = "#bdc3c7";

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

class UserItem extends React.Component {
    constructor(props){
      super(props);
      this.checkBox = this.checkBox.bind(this)
      this.unCheck = this.unCheck.bind(this)
    }
    
    checkBox(){
      if(this.props && this.props.user){
          this.props.addToUserList(this.props.user);       
      }
    }
    
    unCheck(){
      if(this.props && this.props.user){
          this.props.removeUserList(this.props.user);         
      }
      
    }
      
    render(){
      var FormatDate, username, checked;
      var userId;
      if(this.props && this.props.user){
          userId = this.props.user.userId;
      }
      if(this.props && this.props.user){
        username = this.props.user.username;
      }
      if(username){
          var list = this.props.list;
          var tmp = new Array();
          if(list){
              for(var i=0; i < list.length; i++){
                  if(list && list[i]){
                      tmp.push(list[i].username)
                  }
              }
          }
          if(tmp && tmp.includes(username) == true){
              checked = true;    
          }
      }
      return(
          <Card transparent style={styles1.cardStyleCommentReply} >
                  <CardItem style={styles1.cardItemStyleMain} >
                    <Left>
                      <AvatarComp userId={userId} /> 
                      <Body style={{ alignSelf: 'flex-start',paddingLeft: 5 }}>
                        <Text style={{color: '#000000',fontSize: 15,lineHeight:22,paddingBottom:3,marginBottom:2, 
                              top:0,marginTop: 2,paddingTop:0, fontWeight: 'bold' }} >
                           {username}
                        </Text>
                        {checked
                        ? (
                           <View> 
                              <TouchableOpacity onPress={this.unCheck}> 
                                  <Ionicons name="ios-checkbox" size={30} color={primaryColor}/> 
                              </TouchableOpacity>
                          </View>
                        )
                        : (
                          <View> 
                              <TouchableOpacity onPress={this.checkBox}> 
                                  <Ionicons name="ios-square-outline" size={30} color={darkGrey}/> 
                              </TouchableOpacity>
                          </View>
                        )}                      
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
        );
    }
  }

export default class NewMessage extends React.Component {
  static navigationOptions = ({ navigation, screenProps  }) => {
    return{
      title: 'New Message',
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
      personlist: null,
      toList: null,
    };    
    this.addToUserList = this.addToUserList.bind(this)
    this.removeUserList = this.removeUserList.bind(this) 
    this.sendButton = this.sendButton.bind(this)
  }

  componentDidMount(){
  } 
  

  componentDidMount() {
        this._mounted = true;
        var self = this;  
        Meteor.call('personlist', function(err, res){
            if(res){
                self.setState({
                    personlist: res
                })
            }
        })        
    }  
    addToUserList(user){
        var list = this.state.toList;
        if(list == null){
          list = new Array();
        }
        list.push(user);
        this.setState({toList:list, text:null})
        //this.props.changeSearchText(null);
      }    
      removeUserList(user){
        var list = this.state.toList;
        if(list == null){
          list = new Array();
        }
        var tmp = new Array();
        for(var i=0; i < list.length; i++){
          if(list[i]._id != user._id){
            tmp.push(list[i])
          }
        }
        this.setState({toList:tmp, text:null})
        //this.props.changeSearchText(null);
      }    
    renderRow(record, index){
        if(record == null){
          return <View />
        }
        return (<UserItem index={index} key={record._id} 
          user={record} list={this.state.toList}
          addToUserList={this.addToUserList} removeUserList={this.removeUserList}/>); 
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

    sendButton(){
        if(this.state.toList && this.state.body){
            this.setState({
              isProgress: true
            })
            var self = this;
            Meteor.call('newConversation', this.state.body, this.state.toList, function(err, result){
              if(result){          
                self.props.navigation.navigate('MessageScreen', {
                  conversationId: result,
                });    
                //self.props.navigation.navigate('Chat')      
              }
            })
          }      
    }
  
  render(){
    return(
      <SafeAreaView  style={{flex:1, backgroundColor: '#FFFFFF'}} forceInset={{ top: 'never'}}> 
        <KeyboardAwareScrollView style={[styles.fill, {backgroundColor:"#ffffff"}]} behavior="padding" enabled   keyboardVerticalOffset={20}>
        {this.state.personlist && <FlatList
                contentContainerStyle={styles.contentContainer}
                data={this.state.personlist}
                renderItem={({item, index}) => this.renderRow(item, index)}
                ListFooterComponent={this.renderFooter.bind(this)}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={.3}
                bounces={false}
                onMomentumScrollBegin={(event) => { 
                  this.onEndReachedCalledDuringMomentum = false; 
                }}
                keyExtractor={(item, index) => this.keyExtractor(item, index)}
            />}
            <TextInput
                placeholder="Start Message..."
                placeholderColor="#F8FCF9"
                style={styles.loginFormTextInput}
                onChangeText={body => this.setState({
                  body
                })}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.body}
            /> 
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => this.sendButton()}
              title="Send"
            />  
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
  
}

const styles = StyleSheet.create({
    loginFormTextInput: {
        height: 120,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#F8FCF9',
        backgroundColor: '#F8FCF9',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,
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

const styles1 = StyleSheet.create({
    fill: {
      flex: 1,
    },  
    inputBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
      paddingVertical: 3,
      margin: 10,
      marginLeft: 2,
      marginRight: 2,
      flex: 1,
      borderColor: '#ffffff',
      borderTopColor: '#ffffff',
      borderWidth:0,
      width:'100%',
      alignSelf: 'stretch',
    },  
    usernameInitials: {
      color: '#444',
      fontSize: 14
    },  
    sendButton: {
      paddingLeft: 2,
      marginLeft: 5,
      paddingRight: 2,
      borderRadius: 5,
      color:'#00C853',
      backgroundColor: '#ffffff'
    },  
    tabBarInfoContainer: {
      position: 'absolute',
      color: '#000',
      flexDirection: 'row',
      maxHeight: 190,
      height: 60,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      borderColor: '#ffffff',
      borderWidth:1,
      borderTopColor: '#eeeeee',
      backgroundColor: '#ffffff',
      paddingVertical: 5,
      paddingHorizontal: 15
    },  
    buttonPost:{
      backgroundColor:'#00B0FF',
    },  
    loginButton: {
      backgroundColor: '#3897f1',
      borderRadius: 5,
      height: 45,
      marginTop: 1,
      marginLeft: 0,
      marginRight: 15,
      width: 65,
    },    
    cardAvatarlogostyle: {
      height: 52,
      borderRadius: 5,
      width: 52,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center",
      marginTop:0,
    },  
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },  
    iconContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: 120
    },
    fbLoginButton: {
      height: 45,
      marginTop: 10,
      backgroundColor: 'transparent',
      marginLeft: 15,
      marginRight: 15,
    },
    header:{
          backgroundColor: '#c30f42'
      },
      itemHeader:{
          backgroundColor: '#c30f42',
          paddingLeft:10
      },
      iconSearch:{
          color:'white',
          fontSize:20,
          paddingTop:14                                
      },
      iconActive:{
          color:'#c30f42',
          height:27
      },
      header1:{
          fontSize:19,
          paddingTop:25,
          paddingLeft:25,
          paddingBottom:14
      },
      header2:{
          fontSize:19,
          paddingTop:21,
          paddingLeft:25,
          paddingBottom:10
      },
      header3:{
          fontSize:12,
          paddingLeft:25,
          paddingBottom:14,
          color:'black'
      },
      textSearch:{
          color:'white',
          fontWeight:'bold',
      },
      garisBawah:{
          width:'92%',
          color:'white',
          paddingTop:12,
          paddingLeft:5
      },                                             
      textLokasi:{
          color:'white',
      },                                   
      viewItem:{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0, 
          bottom: 0 
      },  
    modalFooter:{
      backgroundColor: "white",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0.2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      height: 54,
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 5,
      borderTopColor: '#eeeeee',
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
      paddingBottom:5,
      //paddingBottom:40,
      top: -5,
      marginTop: 0,
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
    buttonCon:{
      //position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      //alignSelf: 'flex-end',
      //position: 'absolute',
      backgroundColor:'#00B0FF',
    },
    buttonPost:{
      //position: 'absolute',
      backgroundColor:'#00B0FF',
    //   //width: '100%',
    // // height: 50,
    //   marginTop:300,
    //   top:300,
    //   margin: 16,
    //   right: 0,
    //   bottom: 0,  
    },
    modal: {
      justifyContent: "flex-start",
      alignItems: "center",
      position: "absolute",
      // zIndex: 0,
      // //elevation: 4,
      // height: Dimensions.get("window").height - Constants.statusBarHeight,
      // marginTop: Constants.statusBarHeight / 2
    },
    cardStyle:{
      borderBottomColor: '#eeeeee',
      borderBottomWidth: 1, marginBottom: 0, elevation: 0 , marginTop: 0,
      borderTopColor: '#DDDFE2'
      
    },
    cardStyleComment:{
      borderBottomColor: '#eeeeee',
      borderTopWidth: 0,
      borderBottomWidth:1, marginBottom: 0, elevation: 0 , marginTop: 0,
      flex: 1,
    },  
    cardStyleCommentReply:{
      borderBottomColor: '#f7f7f7',
      borderTopWidth: 0,
      borderBottomWidth:1, marginBottom: 0, elevation: 0 , marginTop: 0,
      flex: 1,
    },  
    cardStyleCommentReplySingle:{
      borderBottomColor: '#eeeeee',
      borderTopWidth: 0,
      borderBottomWidth:1, marginBottom: 0, elevation: 0 , marginTop: 0,
      flex: 1,
    },    
    cardItemStyleMain:{
      flexDirection: 'row'
    },  
  });
  
