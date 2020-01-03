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
import moment from 'moment';

import { EvilIcons, Entypo, Feather, MaterialCommunityIcons, Octicons, AntDesign, Ionicons,MaterialIcons, FontAwesome  } from '@expo/vector-icons';


export default class AvatarComp extends React.Component{
  
    constructor(props){
      super(props);
      var self = this;
      this.state = {
        avatar_url: null  
      }
      this.fetchData = this.fetchData.bind(this)
      this.setWithUsername = this.setWithUsername.bind(this)
    }
    
    fetchData = async () => {
        if(this.props.username){
            var self = this;
            Meteor.call('getUserId', this.props.username, function(er, res){
                if(res){
                    self.setWithUsername(res);   
                }            
            })
        }else{
            var userId = this.props.userId
            if(userId){
                var url = await AsyncStorage.getItem(userId.toString())
                this.setState({
                    avatar_url: url
                })
            }
        }

    }

    setWithUsername = async(userId) => {
        var self = this;
        var url = await AsyncStorage.getItem(userId.toString())
        self.setState({
            avatar_url: url
        })    
    }
    
    componentDidMount(){
      this._mounted = true;
      var self = this;
      this.fetchData();   
    }

    componentWillUnmount() {
      this._mounted = false;
      //console.log("unmoutned...")
    }  

    componentDidUpdate(prevProps, prevState){
        if(this.props.urlChanged != prevProps.urlChanged){
            this.fetchData();
        }
    }

    clickFunction(){}
    render() {
      var avatar_url = this.state.avatar_url; 
      if(avatar_url){
        return (
            <TouchableOpacity underlayColor='transparent' onPress={this.goToProfilePage}>
            <Image
              source={{uri: avatar_url.toString()}}
              style={{    
                height: 38,
                borderRadius: 25,
                width: 38,
                alignSelf: "stretch",
                justifyContent: "center",
                alignItems: "center",
                marginTop:0,
                marginRight: 3,}}
            >
            </Image>
            </TouchableOpacity>
        )
      }
      return (
        <TouchableOpacity underlayColor='transparent' onPress={this.goToProfilePage}>
          <Avatar
            size="medium"
            rounded
            icon={{name: 'user', color: 'orange', type: 'font-awesome'}}
            overlayContainerStyle={{backgroundColor: 'white'}}
            activeOpacity={0.7}
            avatarStyle={{    
                height: 38,
                borderRadius: 25,
                width: 38,
                alignSelf: "stretch",
                justifyContent: "center",
                alignItems: "center",
                marginTop:0,
                marginRight: 0,}}
            containerStyle={{left:0,top:0, marginBottom:0, marginLeft:0,marginRight:3, paddingLeft: 0,
                              paddingRight: 3,paddingTop: 0,paddingBottom: 0, 
            alignSelf: 'flex-start',
            marginTop: -2,
                              }}
          />
          </TouchableOpacity>
      )
    }
  }