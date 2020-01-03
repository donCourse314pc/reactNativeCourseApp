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
  Animated,TouchableHighlight,
  View,SafeAreaView,
  AsyncStorage
} from 'react-native';

import { Button, Avatar } from 'react-native-elements';
import Meteor, { withTracker } from 'react-native-meteor';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { DrawerActions, NavigationActions } from 'react-navigation'
import * as WebBrowser from 'expo-web-browser'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as ImageManipulator from 'expo-image-manipulator'

import { Icon } from "react-native-elements";
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
import _ from 'lodash';

const EntypoHeaderButton = props => (
  // the `props` here come from <Item .../>
  // you may access them and pass something else to `HeaderButton` if you like
 <HeaderButton {...props} IconComponent={props.MyIconComponent} iconSize={26} color="#000000" />
);
const IoniconsHeaderButton = props => (
  // the `props` here come from <Item .../>
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton {...props} IconComponent={props.MyIconComponent} iconSize={26} color="#000000" />
);

class ProfileAvatar extends React.Component{
  
    constructor(props){
      super(props);
      var self = this;
      this.state = {
        avatar_url: null  
      }
      this.fetchData = this.fetchData.bind(this)
    }
    
    fetchData = async () => {
      var userId = Meteor.userId()
      var url = await AsyncStorage.getItem(userId.toString())
      this.setState({
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
            <Image
              source={{uri: avatar_url.toString()}}
              style={{    
                height: 50,
                borderRadius: 40,
                width: 50,
                alignSelf: "stretch",
                justifyContent: "center",
                alignItems: "center",
                marginTop:0,
                marginRight: 3,}}
            >
            </Image>
        )
      }
      return (
          <Avatar
            size="medium"
            rounded
            icon={{name: 'user', color: 'orange', type: 'font-awesome'}}
            overlayContainerStyle={{backgroundColor: 'white'}}
            activeOpacity={0.7}
            avatarStyle={{    
                height: 50,
                borderRadius: 25,
                width: 50,
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
      )
    }
  }

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const HEADERBLUE = Platform.OS === 'ios' ? '#1e90ff' : '#1e90ff';
import t from 'tcomb-form-native';
const Form = t.form.Form;
const Profile = t.struct({
    Name: t.String,
    description: t.String,
    website: t.String,
  });
  var options = {
    fields: {
      description: {
        multiline: true,
        stylesheet: {
          ...Form.stylesheet,
          textbox: {
            ...Form.stylesheet.textbox,
            normal: {
              ...Form.stylesheet.textbox.normal,
              height: 100,
              textAlignVertical: 'top',
            },
            error: {
              ...Form.stylesheet.textbox.error,
              height: 100,
            },
          },
         
        },
      },
      date: {
        mode: 'date' // display the Date field as a DatePickerAndroid
      }     
    }
  };

export default class ProfileScreen extends React.Component {

  static navigationOptions = ({ navigation, screenProps  }) => {
      return{
        title: 'Profile',
        headerStyle: { backgroundColor: HEADERBLUE, elevation:1},
        headerTitleStyle: { color: '#fff' },
      };
  };
  constructor(props){
    super(props);
    this.state = {editing: null, name: null, description: null, url: null, urlChanged: 0}
    this.editProfile = this.editProfile.bind(this);
    this.saveFunc = this.saveFunc.bind(this)
    this._changeAvatar = this._changeAvatar.bind(this)
    this.logout = this.logout.bind(this)
    this.clickUrl = this.clickUrl.bind(this)
  }

  componentDidMount(){
    var self = this;
    Meteor.call('getUserObject', function(err, res){
        if(res){
            self.setState({
                name: res.name,
                description: res.description,
                url: res.url
            })
        }
    })
  }

  componentDidUpdate(){
    ////console.log("this componentDidUpdate",this)
  }

  editProfile(){
    this.setState({
        editing: true
    })
  }

  logout(){
    Meteor.logout();
    this.props.navigation.navigate('Auth', {
    });        
  }

  saveFunc(){
      var userdetails = this._form.getValue();
      var self = this;
      Meteor.call('editProfile', userdetails, function(err, res){
          if(res){
              self.setState({
                  editing: null,
                  description: res.description,
                  name: res.name,
                  url:  res.url
              })
          }
      })
  }
  _changeAvatar = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL).then((data) => {
      if (data.status !== 'granted') {
        return;
      }
    });
    const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:'Images',
          allowsEditing: false,
          aspect: [4, 3],
     });
    if (!result.cancelled) {
          let resizeObj = {
          };
          if (result.height > result.width) {
            resizeObj = {
              height: 1200
            };
          } else {
            resizeObj = {
              width: 1200
            };
          }
          let manipResult = await ImageManipulator.manipulateAsync(
            result.uri,
            [{
              resize: resizeObj
            }],
            {
              format: 'jpeg',
            }
          );
          var userId = Meteor.userId();
          AsyncStorage.setItem(userId.toString(), manipResult.uri);  
          var urlChanged = this.state.urlChanged;
          urlChanged = urlChanged + 1;
          this.setState({
            urlChanged: urlChanged
          })
       
    }
  }; 

  clickUrl = async () => {
    if(this.state.url){
        // console.log("this.state.url", this.state.url)
        // await WebBrowser.openBrowserAsync(this.state.url.toString())
        var url = this.state.url;
        url = "http://" + url.toString();
        WebBrowser.openBrowserAsync(
            url
          );
    }
  }
  render() {
    var mypage;
    var user = true;
    var desc = this.state.description;
    var shortDesc;
    var value = {
        Name: this.state.name,
        description: this.state.description,
        website: this.state.url
    }
    if(this.state.description && this.state.description.length > 150){
        shortDesc = true;
        var string = this.state.description;
        var length =140;
        var trimmedString = string.substring(0, length);
        shortDescbio =  trimmedString + "..";        
      }    
    if(this.state.editing == true){
        return(<ScrollView style={[styles.fill, {backgroundColor:"#ffffff"}]}>
            <View style={styles.containerBuildProfileView}>
            <Form
                ref={c => this._form = c}
                type={Profile}
                options={options}
                value={value}
            />
            <Button
                title="Save"
                buttonStyle={styles.doneloginButton}
                onPress={this.saveFunc}
            />
            </View>  
        </ScrollView>);
    }
    return( 
      <SafeAreaView  style={{flex:1, backgroundColor: '#FFFFFF'}} forceInset={{ top: 'never'}}>    
        <View style={{ flex: 1, justifyContent: 'center',}}>
            <View style={{flex:2, padding:10, paddingTop:0, }}>
                <View style={{flex:1, flexDirection:'row', alignItems:'center', marginTop:10, justifyContent:'space-between'}}>
                    <ProfileAvatar urlChanged={this.state.urlChanged} />
                </View>
                <View style={{flex:2, marginLeft: 5}}>  
                    <View>
                        <TouchableHighlight  underlayColor='transparent' onPress={this._changeAvatar}>
                                    <View style={{width:240, height:30, margin:5, backgroundColor:'#4099FF', borderColor:'#4099FF', borderWidth:1, alignItems:"center", justifyContent:'center'}}>
                                        <Text style={{fontWeight:'600', color:'#fff'}}>Change Avatar</Text>
                                    </View>
                        </TouchableHighlight>                           
                        <TouchableHighlight  underlayColor='transparent' onPress={this.editProfile}>
                                    <View style={{width:240, height:30, margin:5, borderColor:'#ddd', borderRadius:4, borderWidth:1, alignItems:"center", justifyContent:'center'}}>
                                        <Text style={{fontWeight:'600', color:'#333'}}>Edit Profile</Text>
                                    </View>
                        </TouchableHighlight>  
                        <TouchableHighlight  underlayColor='transparent' onPress={this.logout}>
                                    <View style={{width:240, height:30, margin:5, borderColor:'#ddd', borderRadius:4, borderWidth:1, alignItems:"center", justifyContent:'center'}}>
                                        <Text style={{fontWeight:'600', color:'#333'}}>Logout</Text>
                                    </View>
                        </TouchableHighlight>                                           
                    </View>                             
                    <Text style={{fontWeight:'700', fontSize:14}}>{this.state.name}</Text>
                    {shortDesc ? 
                    <View>
                    <TouchableHighlight onPress={this.aboutSection} underlayColor='transparent'>
                        <View>
                        <Text style={{fontWeight:'400', fontSize:14, lineHeight: 22,}}>{shortDescbio}</Text> 
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.aboutSection} underlayColor='transparent'>
                        <View>
                        <Text style={{fontWeight:'bold', fontSize:14, lineHeight: 22,}}>... more</Text>
                        </View>
                    </TouchableHighlight>   
                    </View>
                    :
                    <Text style={{fontWeight:'400', fontSize:14, lineHeight: 22,}}>{this.state.description}</Text>}
                    <TouchableHighlight onPress={this.clickUrl} underlayColor='transparent'>
                    <View>
                        <Text style={{fontWeight:'400', fontSize:14, color:'#2f89bd'}}>{this.state.url}</Text>
                    </View>
                    </TouchableHighlight>
                </View>
                <View style={{height:5, borderBottomWidth:0, alignItems:'center', flexDirection:'row', justifyContent:'space-around'}}>
                </View>        
            </View>  
        </View>
        <View style={{flex: 1}}></View>  
      </SafeAreaView>
    )
  }

}


const styles = StyleSheet.create({
    fill: {
      flex: 1,
    }, 
    containerBuildProfileView: {
        flex: 1,
        marginLeft:15,
        marginRight:15,
      },     
})