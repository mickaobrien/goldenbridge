/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import AudioPlayer from './components/player';
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

  sendMessage() {
      //const { webviewbridge } = this.refs;
      console.log('sending message');
      this.refs.webviewbridge.sendToBridge(JSON.stringify(this.state.points));
      //JSON.stringify(locations)
  },

  testState() {
      this.setState({points: {1: ['ha']}});
      console.log(this.state.points);
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Goldenbridge Project
        </Text>
        <TouchableOpacity onPress={this.testState}>
          <Text>'Click!'</Text>
        </TouchableOpacity>
        <WebViewBridge style={styles.web}
            ref="webviewbridge"
            onBridgeMessage={this.sendMessage}
            source={require('./web/test.html')}
            javaScriptEnabled={true}
        />
        <GeolocationExample
            points={this.state.points}
        />
      </View>
    );
  }
});



var GeolocationExample = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      position: 'unknown',
      activePoint: null,
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
          console.log('dist to ' + key + ' is ' + this.getDistance(coords, location));
          if (this.getDistance(coords, location) < 10) {
              this.setState({activePoint: key});
              alert(key);
          }
      }, this);
  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({position});
        this.getNearestPoint();
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position);
      this.setState({position});
    });
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render: function() {
    return (
        <AudioPlayer />
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
