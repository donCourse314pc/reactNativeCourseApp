import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity, FlatList,
  View,StatusBar
} from 'react-native';
import ActionButton from 'react-native-action-button';
//import { MonoText } from '../components/StyledText';
import { MaterialCommunityIcons } from '@expo/vector-icons'
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
import Post from '../components/post'
import Meteor, { withTracker } from 'react-native-meteor';
export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps  }) => {
    return{
      title: 'Home',
      headerStyle: { backgroundColor: '#1e90ff', elevation:1, },
      headerTitleStyle: { color: '#fff', alignSelf: 'center',  },
    };
  };
  constructor(props){
    super(props);
    StatusBar.setBackgroundColor('#1e90ff');
    StatusBar.setBarStyle('light-content');  
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      posts: null,
      postCount: 5,
      refreshing: false
    }    
    this.reloadData = this.reloadData.bind(this)
  }  

  componentDidMount(){
    var self = this;
    Meteor.call('getPosts', this.state.postCount, function(err, res){
      self.setState({
        posts: res
      })
    })
  }

  reloadData(){
    var self = this;
    this.setState({
      refreshing: true
    })
    Meteor.call('getPosts', this.state.postCount, function(err, res){
      self.setState({
        posts: res,
        refresing: false
      })
    })   
  }

  keyExtractor(item, index){
    if(item){
      return item.key
    }
  }

  renderRow(record){
    if(record){
      return(
            <Post key={record.item._id} navigation={this.props.navigation} post={record} />
      )
    }
  } 
  onEndReached = async (distanceFromEnd) => {
    try {
      if(!this.onEndReachedCalledDuringMomentum){
        var self = this;
        var count = this.state.postCount;
        count = count + 10;
        this.setState({
          postCount: null
        })
        this.reloadData();
      }
    }catch(err){
      ////console.log("onendreached",err);
    }
  }  
  render(){
    return (
      <View style={styles.container}>
        <FlatList
        removeClippedSubviews disableVirtualization
        contentContainerStyle={styles.contentContainer}
        data={this.state.posts}
        renderItem={this.renderRow.bind(this)}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={.3}
        onMomentumScrollBegin={(event) => { 
          this.onEndReachedCalledDuringMomentum = false; 
        }}
        keyExtractor={(item, index) => this.keyExtractor(item, index)}
        />
        <ActionButton buttonColor="#1e90ff">
              <ActionButton.Item buttonColor='#9b59b6' title="add post" onPress={() =>                           
                this.props.navigation.navigate('AddPost',{   
                  reload: this.reloadData
                }) }>
                <MaterialCommunityIcons name="plus" style={styles.actionButtonIcon} />
              </ActionButton.Item>
        </ActionButton>      
      </View>
    );
  }
}


const styles = StyleSheet.create({
  
  contentContainer: {
    paddingTop: 2,
    marginTop:2,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  }, 
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
