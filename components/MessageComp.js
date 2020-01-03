import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  ListView, FlatList,
  StatusBar,
  TouchableOpacity,
  Animated, Text,
  View, Alert,InteractionManager,
  AsyncStorage, Modal, Clipboard, KeyboardAvoidingView
} from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
import _ from 'lodash';

const AnimatedListView = Animated.createAnimatedComponent(FlatList);
import AvatarDMComp from  './avatar';
import moment from 'moment';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
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

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

const height = '95%';
 let onScroll = false;
const LOAD_EARLIER_ON_SCROLL_HEGHT_OFFSET = 100;
// ...

class DMItemComp extends React.Component {

    constructor(props) {
        super(props);
        this.onEndReachedCalledDuringMomentum = true;
        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);
        this.state = {
          loading: false,
          mounted: false,
          isLoadingEarlier: null,
          messageCount:20,
          selectedIndex: 0,
          refreshing:false,
          dataSource: [],
          data: [],
          dataSource: [],
          dataReady:null,
          open: false,
          postType: null,
          visibleModal: false, 
          text: null,
          imageUri: null,
          imageSignature:null,
          notLoaded:true,
          removeUsersCalled: null,
          currentMessage: null
        };
    
        var self = this;
        this.onSend = this.onSend.bind(this);
        this.renderBubble = this.renderBubble.bind(this)
        
    }
    _clampedScrollValue = 0;
    _offsetValue = 0;
    _scrollValue = 0;

    componentDidMount() {
        this._mounted = true;
        var self = this;
    }
    componentWillUnmount(){
      if(this.props.messageHandler){
        this.props.messageHandler.stop();  
      }
      if(this.props.userHandler){
        this.props.userHandler.stop();
      }
    }
     
    
    renderItem(obj){
      if(obj && obj.currentMessage && obj.currentMessage.user){
        var username;
        var userId = obj.currentMessage.user._id;
        return <AvatarDMComp userId={userId} />
      }
      return <View />
    }
    

    renderSend(obj) {
        return (
          <TouchableOpacity
                  style={[style1.container2]}
                  onPress={this.onSend}
                >
            <Text style={{color: '#1e90ff'}}>Send</Text>
           </TouchableOpacity>
        );
    } 
    
    
    renderBubble(props) {
      var adminAccess, id;
      var user = Meteor.user();
      if(props && props.currentMessage && props.currentMessage.user && props.currentMessage.user._id == Meteor.userId()){   
        adminAccess = true;
        id = props.currentMessage._id
      }      
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#F5F4F4',
                    },
                    right:{
                      backgroundColor: '#1e90ff',
                    }
                }}
                textStyle={{
                    right: {
                        color: '#ffffff',
                        fontSize: 15,
                        lineHeight:23,
                    },
                    left: {
                        color: '#000',
                        fontSize: 15,
                        lineHeight:23,
                    }
                }}
            />
        );
    }
    
    getMoreMessages(){
      if(this._mounted == true){
        this.setState({
          getMoreMessages: true,  
        })
        if(this.state.messageCount < this.props.ListCount){
            this.setState({
                messageCount: this.state.messageCount + 10
            })
            
        }else{
          this.props.increaseParentCount();
        }
        this.setState({
          getMoreMessages: false,  
        })
      }
    }
    
    deleteMsg(id){
      Meteor.call('DeleteDirectMessageSingle',id);      
    }
        
    onSend(messages1){
      var text = this.state.text;
      var msg = text;
      if(msg){
          msg = msg.replace(/^\s+|\s+$/g, "");
      }
      if(msg && msg.length > 0){
        Meteor.call('newMessageInsert', this.props.conversationId, text);
        this.setState({text:null, androidAutoCorrectFix: Platform.OS !== 'android'})
        Platform.OS === 'android' && (() => this.setState({androidAutoCorrectFix: true}))
      }
    }

    LongPress(currentMessage) {
        if(currentMessage && deleteMsg.user && currentMessage.user._id == Meteor.userId()){
            Alert.alert(
                'delete',
                'delete message',
                [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                {text: 'OK', onPress: this.deleteMsg(currentMessage._id)},
                ],
                { cancelable: false }
            )  
        }
    }   
   
    
    isTop(e){
      this.getMoreMessages();
    }
    
    render() {  
      var dataReady, avatar, username, messagesReady;
      var text;
      if(this.state.text == null){
        text = 'start writing...'
      }
      var userId = Meteor.userId();
      var user = Meteor.user();
      if(user){
        username = user.username;
      }
      if(user && user.avatar){
        avatar = user.avatar.image_url;
      }
      if(this.props.conversations != null){
        dataReady = true;
      }
      if(this.props.messages != null) {
        messagesReady = true;    
      }
      if(this.props.messages == null || this.props.messages == [] ){
      return (
        <View style={styles.loadMoreHistorycontainer}>
          <ActivityIndicator size="large" color="rgb(29, 161, 242)" />
        </View>);      
      }           
      return (
        <KeyboardAvoidingView style={{ flexGrow: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          {this.props.messages && <GiftedChat
            textInputProps={{
                autoCorrect: Platform.OS === 'ios' || this.state.androidAutoCorrectFix
            }} 
            listViewProps={
              {
                onEndReached: this.isTop.bind(this),
                onEndReachedThreshold: 0.5,
              }
            }            
            style={{flex: 1}}
            placeholder={text}
            text={this.state.text} 
            keyboardShouldPersistTaps={'never'}
            messages={this.props.messages}
            onSend={messages => this.onSend(messages)}
            showUserAvatar={true}
            isLoadingEarlier={this.state.getMoreMessages}
            onInputTextChanged={text => this.setState({ text })}
            onLongPress ={(ctx, currentMessage) => this.LongPress(currentMessage)}
            onLoadEarlier={() => this.getMoreMessages()}
            renderAvatar={obj => this.renderItem(obj)}
            renderBubble={obj =>  this.renderBubble(obj)}
            renderSend={obj => this.renderSend(obj)}  
            user={{
              _id: userId,
              name: username,
              avatar: avatar,
            }}
        />}   
        </KeyboardAvoidingView>
        );
    }

}


export default withTracker(params => {
    var messageCount = params.ListCount;
    var conversationId = params.conversationId;
    var messageHandler1, userHandler1;
      messageHandler1 = Meteor.subscribe('messages', conversationId, messageCount);
    var array = new Array();
    var messages = new Array();
    array = Meteor.collection('messages').find({conversationId:conversationId}, {sort: {createdAt: -1}});
    _.each(array,function(obj){
      if(obj){     
        var message = {
          _id: obj._id,
          text: obj.text,
          createdAt: obj.date,
          user:{
            _id: obj.userId,
            name: obj.username,
          },
        }
        messages.push(message);
      }
    })
    return {
      messages: messages,
      messageHandler: messageHandler1,
      userHandler: userHandler1      
    };
})(DMItemComp);

const style1 = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  container2: {
    width: 50,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },  
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 15,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

const stylez = {
    left: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            marginLeft: 8,
            marginRight: 0,
        },
    }),
    right: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginLeft: 0,
            marginRight: 8,
        },
    }),
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#f7f7f7',
    borderBottomWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 0,
    fontWeight: '600',
    color: '#222',
    fontSize: 16,

  },
  time: {
    fontWeight: '200',
    color: '#83929E',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#83929E',
    fontSize: 14,
  },  
  fill: {
    flex: 1,
  },  
  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14
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
    height
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
    backgroundColor:'#00C853',
  },
  buttonPost:{
    //position: 'absolute',
    backgroundColor:'#00C853',
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

