/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
// Import the react-native-sound module
//var Sound = require('react-native-sound');
import ProgressBar from './components/progress-bar';
import Sound from 'react-native-sound';
import TimerMixin from 'react-timer-mixin';
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
  mixins: [TimerMixin],
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      position: 'unknown',
      playing: false,
      currentTime: 0,
      progress: 0,
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
    this.loadSound();
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
    //this.setInterval(function() {
        //if (this.state.sound) {
            //this.state.sound.getCurrentTime((time, isPlaying) => {
                //this.setState({
                    //'currentTime': time,
                    //'playing': isPlaying,
                    //'progress': time/this.state.sound.getDuration(),
                //});
            //});
        //}
    //}, 100);
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  loadSound: function() {
    var filename = 'music.mp3';
    //var filename = 'moo.mp3';
    //var filename = 'one.mp3';
    //console.log('MB: ' + Sound);
    var sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
    //var sound = new Sound(filename, './', (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        console.log('duration in seconds: ' + sound.getDuration() +
            'number of channels: ' + sound.getNumberOfChannels());
        this.setState({'sound': sound});
      }
    });
  },


  playSound: function() {
    if (this.state.sound) {
        this.state.sound.play((success) => {
            if (success) {
                alert('finished playing');
            } else {
                alert('playback failed');
            }
        });
        //this.state.sound.setCurrentTime(this.state.sound.getDuration() - 5);
    }
  },

  pauseSound: function() {
    if (this.state.sound) {
        this.state.sound.pause();
        // TODO manage playing state using getCurrentTime
    }
  },

  playPause: function() {
      if (this.state.sound) {
          var s = this.state.sound;
          LayoutAnimation.linear();
          //LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
          this.setState({'sound': false});
          //alert(JSON.stringify(!this.state.sound && styles.playerHidden.height));
          setTimeout(function() { 
              //alert('bla');
              LayoutAnimation.linear();
              this.setState({'sound': s});
          }.bind(this), 2000);
      }
      //if (this.state.sound) {
          //console.log('playing: ' + this.state.playing);
          //this.state.playing ? this.pauseSound() : this.playSound();
      //}
  },

  render: function() {
    return (
      <View style={[styles.player, !this.state.sound && styles.playerHidden]}>
        <ProgressBar progress={this.state.progress} />
        <TouchableOpacity onPress={this.playPause}>
          <Text style={styles.button}>{this.state.playing ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
      <Text>{this.state.progress} - {JSON.stringify(this.state.position.coords)}</Text>
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tb: {
    borderColor: '#939393',
    borderWidth: 10,
    width: 10,
  },
  player: {
    height: 50,
    position: 'absolute',
    backgroundColor: '#F5FCFF',
    left: 0,
    right: 0,
    bottom: 0,
  },
  playerHidden: {
    height: 0.001,
  },
});


AppRegistry.registerComponent('Goldenbridge', () => Goldenbridge);
