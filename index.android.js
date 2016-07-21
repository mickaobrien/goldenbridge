/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import store from 'react-native-simple-store';
import WebViewBridge from 'react-native-webview-bridge';
import _ from 'lodash';
import AudioPlayer from './components/player';
import Geolocation from './components/geolocation';
import IntroductionModal from './components/introduction';
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
      activePoint: null,
    };
  },

  componentDidMount() {
    this.loadData();
    MusicPlayer.playSound('music.mp3', -1);
  },

  componentWillUpdate() {
    this.sendMessage();
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
        if (!_.isEmpty(points)) { //TODO it should be null or valid, check saving/loading
          alert(JSON.stringify(points));
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

  activePoint() {
    if (this.state.activeKey) {
      return this.state.points[this.state.activeKey];
    }
    return {activePoint: {audio: null, visited: null}};
  },

  updatePosition(position) {
    console.log('updating position');
    this.sendMessage({currentPosition: position.coords});
    var activeKey = getNearestPoint(this.state.points, position);
    this.setState({activeKey});
  },

  markPointVisited() {
    //TODO ugh, this is a mess...
    var points = this.state.points;
    points[this.state.activeKey].visited = true;
    this.setState({points});
    //this.sendMessage();
    //this.saveData();
  },

  render() {
    return (
      <View style={styles.container}>
        <Geolocation
            onPositionUpdate={this.updatePosition}
        />
        <Text style={styles.welcome}>
          Goldenbridge Project
        </Text>
        <IntroductionModal />
        <WebViewBridge style={styles.web}
            ref="webviewbridge"
            onBridgeMessage={this.sendMessage}
            source={require('./web/test.html')}
            javaScriptEnabled={true}
        />
        <AudioPlayer
            sound={this.activePoint().audio}
            autoplay={!this.activePoint().visited}
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
