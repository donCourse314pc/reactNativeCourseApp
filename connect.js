import Meteor from 'react-native-meteor';

export default function() {
    const url = 'ws://34.201.11.31:8080/websocket'
    Meteor.connect(url);
}
