'use strict';

import ProgressBar from './progress-bar';
import React from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import TimerMixin from 'react-timer-mixin';

var AudioPlayer = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      playing: false,
      currentTime: 0,
      progress: 0,
    };
  },

  componentDidMount: function() {
    this.loadSound();
    this.setInterval(function() {
      if (this.state.sound) {
        this.state.sound.getCurrentTime((time, isPlaying) => {
          this.setState({
            'currentTime': time,
            'playing': isPlaying,
            'progress': time/this.state.sound.getDuration(),
          });
        });
      }
    }, 100);
  },

  loadSound: function() {
    var filename = 'music.mp3';
    var sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        console.log('duration in seconds: ' + sound.getDuration() +
                    'number of channels: ' + sound.getNumberOfChannels());
        this.setState({'sound': sound});
      }
    });
  },

  pauseSound: function() {
    if (this.state.sound) {
      this.state.sound.pause();
    }
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
    }
  },

  playPause: function() {
    //if (this.state.sound) {
      //var s = this.state.sound;
      //LayoutAnimation.linear();
      //this.setState({'sound': false});
      //setTimeout(function() {
        //LayoutAnimation.linear();
        //this.setState({'sound': s});
      //}.bind(this), 2000);
    //}
    if (this.state.sound) {
      console.log('playing: ' + this.state.playing);
      this.state.playing ? this.pauseSound() : this.playSound();
    }
  },

  render: function() {
    return (
      <View style={[styles.player, !this.state.sound && styles.playerHidden]}>
      <ProgressBar progress={this.state.progress} />
      <TouchableOpacity onPress={this.playPause}>
      <Text style={styles.button}>{this.state.playing ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <Text>{this.state.progress} - </Text>
      </View>
    );
  },

});

const styles = StyleSheet.create({
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

module.exports = AudioPlayer;
