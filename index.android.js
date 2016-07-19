/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import AudioPlayer from './components/player';
import MusicPlayer from './components/music-player';
import WebViewBridge from 'react-native-webview-bridge';
//import getLocation from 'geolocation-distances';
import geodist from 'geodist';
import {
  AppRegistry,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }

var Goldenbridge = React.createClass({
  getInitialState() {
    return {points: this.loadPoints()};
  },

  loadPoints() {
    return require('./data/locations.json');
  },

  sendMessage(data) {
    //const { webviewbridge } = this.refs;
    console.log('sending message');
    if (typeof(data) != 'object') {
      this.refs.webviewbridge.sendToBridge(JSON.stringify(this.state.points));
    } else {
      this.refs.webviewbridge.sendToBridge(JSON.stringify(data));
    }
    //JSON.stringify(locations)
  },

  updatePosition(position) {
    console.log('updating position');
    this.sendMessage({currentPosition: position.coords});
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Goldenbridge Project
        </Text>
        <WebViewBridge style={styles.web}
            ref="webviewbridge"
            onBridgeMessage={this.sendMessage}
            source={require('./web/test.html')}
            javaScriptEnabled={true}
        />
        <GeolocationExample
            points={this.state.points}
            onPositionUpdate={this.updatePosition}
        />
      </View>
    );
  }
});



var GeolocationExample = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      //position: 'unknown',
      position: {coords: {latitude:0, longitude:0}},
      activePoint: {audio: null, visited: null},
    };
  },

  getDistance: function(l1, l2) {
    var p1 = {lat: l1[0], lon: l1[1]};
    var p2 = {lat: l2[0], lon: l2[1]};
    return geodist(p1, p2, {exact: true, unit: 'meters'});
  },

  getNearestPoint: function() {
    var position = this.state.position.coords;
    var coords = [position.latitude, position.longitude];
    var points = this.props.points;
    Object.keys(points).forEach(function(key) {
      var location = points[key].coordinates;
      if (this.getDistance(coords, location) < 10) {
        this.setState({activePoint: points[key]});
        //alert('nearest point is ' + key + '\n' + JSON.stringify(this.state.activePoint));
      }
    }, this);
  },

  componentDidMount: function() {
    MusicPlayer.playSound('music.mp3', -1);
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        this.props.onPositionUpdate(position);
        this.setState({position});
        this.getNearestPoint();
      },
      (error) => {
        console.log('watchPosition error: ' + error.message);
      },
      {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000, distanceFilter: 1}
    );
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
    MusicPlayer.pause();
  },

  render: function() {
    return (
      <AudioPlayer
          sound={this.state.activePoint.audio}
          autoplay={!this.state.activePoint.visited}
      />
    );
  }
});


const styles = StyleSheet.create({
  web: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#ffff00',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});


AppRegistry.registerComponent('Goldenbridge', () => Goldenbridge);
