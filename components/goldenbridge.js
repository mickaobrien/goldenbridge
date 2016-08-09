'use strict';

import Icon from 'react-native-vector-icons/FontAwesome';
import React, { Component } from 'react';
import store from 'react-native-simple-store';
import WebViewBridge from 'react-native-webview-bridge';
import _ from 'lodash';
import AudioPlayer from './player';
import Geolocation from './geolocation';
import IntroductionModal from './modal';
import getNearestPoint from './helpers';
import {
  AppState,
  Navigator,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  TouchableOpacity,
  View,
} from 'react-native';

if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }

var Goldenbridge = React.createClass({
  getInitialState() {
    return {
      points: {},
      visited: [],
      position: {coords: {latitude:0, longitude:0}},
      activePoint: null,
      ready: false,
    };
  },

  componentDidMount() {
    this.loadVisited();
    this.setState({points: this.loadPoints()});
  },

  componentWillUpdate() {
    this.sendMessage();
  },

  loadPoints() {
    return require('../data/locations.json');
    //return require('../data/bristol.json');
    //return require('../data/cork.json');
  },

  saveData() {
    store.save('visited', this.state.visited).catch(error => {
        console.log('storage error:\n' + JSON.stringify(error));
    });
  },

  loadVisited() {
    store.get('visited').then(
      (visited) => {
        var visited = visited || [];
        this.setState({visited});
      }
    );
  },

  clearData() {
    store.delete('visited');
  },

  sendMessage(data) {
    if (typeof(data) != 'object') {
      this.refs.webviewbridge.sendToBridge(JSON.stringify(this.points()));
    } else {
      this.refs.webviewbridge.sendToBridge(JSON.stringify(data));
    }
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

  points() {
    var points = this.state.points;
    var visited = this.state.visited;
    visited.forEach(function(k) {
      points[k].visited = true;
    });
    return points;
  },

  markPointVisited() {
    //TODO ugh, this is a mess...
    var visited = this.state.visited;
    visited.push(this.state.activeKey);
    this.setState({visited});
    this.sendMessage();
    this.saveData();
  },

  setReady() {
    this.setState({ready: true});
  },

  goBack() {
    this.props.navigator.pop();
  },

  titleText() {
    if (this.state.activeKey) {
      return this.state.points[this.state.activeKey].title.replace('`', '\'');
    }
    return 'Echoes From The Past';
  },

  subtitleText() {
    if (this.state.activeKey) {
      return this.state.points[this.state.activeKey].citation.replace('`', '\'');
    }
    return 'Goldenbridge Industrial School';
  },

  render() {
    var webPath = (Platform.OS === 'android') ? {uri: 'file:///android_asset/web/test.html'} : require('../web/test.html');
    return (
      <View style={styles.container}>
        <Geolocation
          onPositionUpdate={this.updatePosition}
        />
        <View style={styles.titlebar}>
          <TouchableOpacity onPress={this.goBack} style={styles.backTouchableArea}>
            <Icon name={'chevron-left'} style={styles.backButton} />
          </TouchableOpacity>
          <View style={styles.titleTextBar}>
            <Text style={styles.titleText}>
              {this.titleText()}
            </Text>
            <Text style={styles.citation}>
              {this.subtitleText()}
            </Text>
          </View>
          <TouchableOpacity style={styles.backTouchableArea}>
            <Icon name={'chevron-left'} style={[styles.backButton, {height: 0.001}]} />
          </TouchableOpacity>
        </View>
        <IntroductionModal
          onClose={this.setReady}
          visible={!this.state.ready}
        />
        <WebViewBridge style={styles.web}
          ref="webviewbridge"
          onBridgeMessage={this.sendMessage}
          source={webPath}
          javaScriptEnabled={true}
        />
        <AudioPlayer
          background='music'          
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
  titlebar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
  },
  titleTextBar: {
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  citation: {
    fontSize: 16,
    textAlign: 'center',
    margin: 4,
    fontStyle: 'italic',
  },
  backButton: {
    fontSize: 16,
  },
  backTouchableArea: {
    padding: 8,
    width: 50,
  }
});

module.exports = Goldenbridge;
