import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View
} from 'react-native';

import { Accelerometer } from 'expo-sensors';

export default class WebSocketDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      connected: false,
      message: null,
      error: null,
      sendMessage: null,
      accelerometerData: {},
    };
    this.connect()
  };

  componentDidMount(){
    this._toggle();
    const ws = this.socket

    ws.onmessage = (e) => {
      // a message was received
      this.setState({ message: `${this.state.message}\n${e.data}` });
    };

    ws.onerror = (e) => {
      // an error occurred
      this.setState({ error: e.message });
    };

    ws.onclose = (e) => {
      // connection closed
      this.setState({ message: `Connection closed - ${e.code}: ${e.reason}`});
    };

  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  connect() {
    this.socket = new WebSocket('ws://192.168.15.3:8081/');
    this.socket.onopen = () => {
      this.setState({connected:true})
      this.setState({ message: 'Connected'})
    };
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  _subscribe = () => {
    Accelerometer.setUpdateInterval(1000);
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
      this.socket.send(JSON.stringify(accelerometerData))
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  handleSendMessage = () => {
    const ws = this.socket
    ws.send(this.state.sendMessage); // send a message
    // needs error handling
  }

  handleAccelerometerSend = () => {
    const ws = this.socket
    ws.send(this.state.sendMessage); // send a message
    // needs error handling
  }

  render(){
    return(
      <View>
        <Text>{this.state.message}</Text>
        <Text>{this.state.accelerometerData.x}</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => this.setState({ sendMessage: text})}
          value={this.state.setMessage}
        />
        <TouchableOpacity
          onPress = {this.handleSendMessage}
          style={{height: 30, width: 100}}
        >
          <Text>Send Message!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress = {() => this.connect()}
          style={{height: 30, width: 100}}
        >
          <Text>reconnect!</Text>
        </TouchableOpacity>
      </View>
    )
  }

}


//https://facebook.github.io/react-native/docs/network.html


/*Client Side server code js
//https://www.sitepoint.com/real-time-apps-websockets-server-sent-events/
var socket = new WebSocket('ws://192.168.15.3:8081/');
socket.onopen = function(event) {
  log('Opened connection 🎉');
  var json = JSON.stringify({ message: 'Hello' });
  socket.send(json);
  log('Sent: ' + json);
}

socket.onerror = function(event) {
  log('Error: ' + JSON.stringify(event));
}

socket.onmessage = function (event) {
  log('Received: ' + event.data);
}

socket.onclose = function(event) {
  log('Closed connection 😱');
}

document.querySelector('#close').addEventListener('click', function(event) {
  socket.close();
  log('Closed connection 😱');
});

document.querySelector('#send').addEventListener('click', function(event) {
  var json = JSON.stringify({ message: 'Hey there' });
  socket.send(json);
  log('Sent: ' + json);
});

var log = function(text) {
  var li = document.createElement('li');
  li.innerHTML = text;
  document.getElementById('log').appendChild(li);
}

window.addEventListener('beforeunload', function() {
  socket.close();
});
*/
