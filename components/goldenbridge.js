'use strict';

import React, { Component } from 'react';
import store from 'react-native-simple-store';
import WebViewBridge from 'react-native-webview-bridge';
import _ from 'lodash';
import AudioPlayer from './player';
import Geolocation from './geolocation';
import IntroductionModal from './modal';
import MusicPlayer from './music-player';
import getNearestPoint from './helpers'
import {
  AppRegistry,
  Navigator,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  TouchableHighlight,
  View,
} from 'react-native';

if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }

var Goldenbridge = React.createClass({
  getInitialState() {
    return {
      points: {},
      position: {coords: {latitude:0, longitude:0}},
      activePoint: null,
      ready: false,
    };
  },

  componentDidMount() {
    this.loadData();
    MusicPlayer.playSound('music.ogg', -1);
  },

  componentWillUpdate() {
    this.sendMessage();
  },

  loadPoints() {
    //return require('../data/locations.json');
    return require('../data/cork.json');
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
    // Don't activate anything until the user is ready
    if (!this.state.ready) {
      this.sendMessage({currentPosition: position.coords, activeKey: null});
      return;
    }
    console.log('updating position');
    var activeKey = getNearestPoint(this.state.points, position);
    this.setState({activeKey});
    this.setState({position});
    this.sendMessage({currentPosition: position.coords, activeKey: activeKey});
  },

  markPointVisited() {
    //TODO ugh, this is a mess...
    var points = this.state.points;
    points[this.state.activeKey].visited = true;
    this.setState({points});
    this.sendMessage();
    //this.saveData();
  },

  setReady() {
    this.setState({ready: true});
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
        <IntroductionModal
          onClose={this.setReady}
          visible={!this.state.ready}
        />
        <WebViewBridge style={styles.web}
            ref="webviewbridge"
            onBridgeMessage={this.sendMessage}
            source={require('../web/test.html')}
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

module.exports = Goldenbridge;
