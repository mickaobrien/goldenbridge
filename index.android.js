/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import store from 'react-native-simple-store';
import WebViewBridge from 'react-native-webview-bridge';
import AudioPlayer from './components/player';
import Geolocation from './components/geolocation';
import MusicPlayer from './components/music-player';
import getNearestPoint from './components/helpers'
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }

var Goldenbridge = React.createClass({
  getInitialState() {
    return {
      points: {},
      position: {coords: {latitude:0, longitude:0}},
      activePoint: {audio: null, visited: null},
    };
  },

  componentDidMount() {
    this.loadData();
    MusicPlayer.playSound('music.mp3', -1);
  },

  loadPoints() {
    return require('./data/locations.json');
  },

  saveData() {
    alert('save');
    store.save('points', this.state.points).catch(error => {
        alert('storage error:\n' + JSON.stringify(error));
    });
  },

  loadData() {
    store.get('points').then(
      (points) => {
        if (points !== null) {
          this.setState({points});
        } else {
          this.setState({points: this.loadPoints()});
        }
      }
    );
  },

  clearData() {
    store.delete('points');
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
    var activePoint = getNearestPoint(this.state.points, position);
    if (activePoint) {
      this.setState({activePoint: this.state.points[activePoint]});
    } else {
      this.setState({activePoint: {audio: null, visited: null}});
    }
  },

  markPointVisited() {
    //TODO ugh, this is a mess...
    var points = this.state.points;
    points[this.state.activeKey].visited = true;
    this.setState({points});
    this.sendMessage();
    this.saveData();
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
        <Geolocation
            onPositionUpdate={this.updatePosition}
        />
        <AudioPlayer
            sound={this.state.activePoint.audio}
            autoplay={!this.state.activePoint.visited}
            onCompletion={this.markPointVisited}
        />
      </View>
    );
  }
});



const styles = StyleSheet.create({
  web: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#F6F6F4',
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
