import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableHighlight,
  TouchableOpacity,AsyncStorage
} from 'react-native'
import { CardItem, Card, Left, Thumbnail, Body, Text, Icon, Right, RefreshControl, List, ListItem } from 'native-base';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Meteor, { withTracker } from 'react-native-meteor';
import { Button, Avatar } from 'react-native-elements';
import AvatarComp from './avatar'
import moment from 'moment';

import { EvilIcons, Entypo, Feather, MaterialCommunityIcons, Octicons, AntDesign, Ionicons,MaterialIcons, FontAwesome  } from '@expo/vector-icons';

import { WebBrowser } from 'expo';
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

export default class PostComponent extends Component{
  
  constructor(props){
    super(props);
    var likes;
    if(this.props.post && this.props.post.item && this.props.post.item._likeCount){
      likes = this.props.post.item._likeCount;
    }
    else{
      likes = 0;
    }
    var counter;
    var likedByMe;
    if(this.props.post && this.props.post.item && this.props.post.item._likeCount){
      //////////console.log("count",this.props.post._likeCount)
      counter = this.props.post.item._likeCount;
    }
    else if(this.props.post && this.props.post.item && this.props.post.item._likeCount < 0){
      counter = 0;
    }
    else{
      counter = 0;
    }

    if(counter < 0){
      counter = 0;
    }
    var commentCount;
    if(this.props.post && this.props.post.item && this.props.post.item._commentCount){
        commentCount = this.props.post.item._commentCount;
    }
    else{
        commentCount = 0;
    }      

    this.state = {
      counter: counter,
      commentCount:commentCount,
      refreshing: false
    };
    this.LikeOnly = this.LikeOnly.bind(this)
  }
  componentDidMount(){
    this._mounted = true;
  }
  
  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.post && this.props.post && nextProps.post.item != this.props.post.item || nextState != this.state){
      return true  
    }
    return false;
  }
  componentDidUpdate(){
  }
  onLoad(){
  }
  
  goToComments = () => {
  }
  
  LikeOnly(){
    var count = this.state.counter;
     count = count + 1;
     this.setState({
         counter: count
     })
     var id, userId;
     if(this.props.post && this.props.post.item && this.props.post.item._id){
       id = this.props.post.item._id;
     }
    if(id){
        Meteor.call('incLIke', id)
    }
  }
  render() {
    var FormatDate, showFunctionButton, adminFlag, meetupId, avatar;
    var user = Meteor.user();
    if(this.props && this.props.post && this.props.post.item){
      FormatDate = formatDate(this.props.post.item.createdAt);
    }         
    var id, userId;
    if(this.props.post && this.props.post.item && this.props.post.item._id){
      id = this.props.post.item._id;
    }
    if(this.props.post && this.props.post.item && this.props.post.item.userId){
      userId = this.props.post.item.userId;
    }    
    var username;
    if(this.props && this.props.post && this.props.post.item){
      username = this.props.post.item.username;
    }

    var body;
    if(this.props && this.props.post && this.props.post.item){
        body = this.props.post.item.body;
      }
    if(this.props.post){    
      return (
        <Card transparent style={styles.cardStyle} >
          <CardItem button style={styles.cardItemStyleMain} onPress={this.goToComments}>
            <Left>
              <AvatarComp navigation={this.props.navigation} userId={userId}/> 
              <Body style={{ alignSelf: 'flex-start' }}>
                <Text style={{ fontWeight: 'bold', marginBottom:2, flexDirection: 'row', }}>
                  <Text style={{ color: '#000', fontWeight: 'normal', fontSize: 13 }}>{username} {' '}   </Text> 
                  <Text style={{ color: '#8F9CA7', fontWeight: 'normal', fontSize:13, paddingLeft: 10 }}>
                    {FormatDate}
                  </Text>
                </Text>
                 
                <Text style={{ color: '#000', fontWeight: 'normal' }}>{body} </Text>            
                <View style={styles.socialBarContainer}>
                    <TouchableOpacity style={styles.socialBarSection} onPress={this.LikeOnly}>
                        <FontAwesome name="heart-o" size={13}  color={"#5A6B78"} style={{marginTop: 2}}/>
                        <Text style={[{color:"#5A6B78", fontSize:11, fontWeight: '200', marginTop: 1, marginLeft: 3}]}>{this.state.counter}</Text> 
                      </TouchableOpacity>
                      <View >
                          <TouchableOpacity style={styles.socialBarSection} onPress={() => this.goToComments()}>
                            <Feather style={{marginTop: 2}} name="message-circle" size={13} color={'#5A6B78'} />
                            <Text style={[{color:"#83929E", fontSize:11, fontWeight: '200',marginTop:1, marginLeft: 3}]}>
                              {this.state.commentCount}
                            </Text>  
                          </TouchableOpacity>
                        </View>                                   
                </View>            
              </Body>
            </Left>
          </CardItem>     
        </Card>
  
      )
    }
    return(<View/>)    
  }
}


const styles = StyleSheet.create({
    cardAvatarlogostyleProfile: {
        height: 80,
        borderRadius: 40,
        width: 80,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        marginTop:0,
        marginRight: 3,
      },    
      cardAvatarlogostyleDM: {
        height: 45,
        borderRadius: 25,
        width: 45,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        marginTop:0,
        marginRight: 3,
      },  
      ucardAvatarlogostyle: {
        height: 50,
        borderRadius: 25,
        width: 50,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        marginTop:0,
        marginRight: 0,
      },  
      cardAvatarlogostyle: {
        height: 42,
        borderRadius: 25,
        width: 42,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        marginTop:0,
        marginRight: 15,
      },
      smallcardAvatarlogostyle: {
        height: 32,
        borderRadius: 18,
        width: 32,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        marginTop:0,
      },  
      cardStyle:{
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1, marginBottom: 0, elevation: 0 , marginTop: 0,
        borderTopColor: '#DDDFE2',
        flex: 1,
      },
      cardStyleChannel:{
        borderBottomColor: '#EDEEEE',
        borderBottomWidth: 1, marginBottom: 0, elevation: 0 , marginTop: 0,
        marginLeft: 0, marginRight: 0,
        borderTopColor: '#EDEEEE',
        flex: 1,
      },  
      cardStyleComment:{
        borderBottomColor: '#eeeeee',
        borderTopWidth: 0,
        borderBottomWidth:1, marginBottom: 0, elevation: 0 , marginTop: 0,
        flex: 1,
      },  
      cardStyleCommentReply:{
        borderBottomColor: '#eeeeee',
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
      socialBarContainer: {
        //justifyContent: 'center',
        //alignSelf: 'flex-start',
        flexDirection: 'row',
        flex: 1,
        marginTop:3, 
        marginBottom:0, 
        marginLeft:1,
        marginRight:0, 
        paddingLeft: 1,
        paddingRight: 0,
        paddingTop: 4,
        paddingBottom: 0     
      },  
      socialBarSection: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 5, 
        marginRight: 20 
      },    
});