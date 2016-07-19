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
import Icon from 'react-native-vector-icons/FontAwesome';
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

  componentWillReceiveProps: function(props) {
    if (!props.sound || props.sound == this.props.sound) return;
    if (this.state.sound) this.state.sound.stop();
    this.loadSound(props.sound, props.autoplay);
    //TODO make this a separate method and stop when audio stops
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

  loadSound: function(filename, autoplay) {
    var sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        console.log('duration in seconds: ' + sound.getDuration() +
                    'number of channels: ' + sound.getNumberOfChannels());
        this.setState({'sound': sound});
        if (autoplay) {
          this.playSound();
        }
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
          //TODO mark visited when finished playing
          alert('finished playing');
        } else {
          alert('playback failed');
        }
      });
    }
  },

  playPause: function() {
    if (this.state.sound) {
      this.state.playing ? this.pauseSound() : this.playSound();
    }
  },

  tapProgressBar(progress) {
    this.state.sound.setCurrentTime(progress*this.state.sound.getDuration());
  },

  render: function() {
    return (
      <View style={[styles.player, !this.state.sound && styles.playerHidden]}>
        <TouchableOpacity
            style={styles.playPause}
            onPress={this.playPause}>
          <Icon
            style={styles.playPauseIcon}
            name={this.state.playing ? 'pause' : 'play'} />
        </TouchableOpacity>
        <ProgressBar
            style={styles.progress}
            progress={this.state.progress}
            onTap={this.tapProgressBar}
        />
      </View>
    );
  },

});

const styles = StyleSheet.create({
  player: {
    height: 20,
    position: 'absolute',
    backgroundColor: '#F5FCFF',
    left: 0,
    right: 0,
    bottom: 1,
    flexDirection: 'row',
  },
  playerHidden: {
    height: 0.001,
  },
  playPause: {
    width: 24,
  },
  playPauseIcon: {
    fontSize: 16,
    margin: 2,
    marginLeft: 6,
    alignItems: 'center',
  },
  progress: {
    flex: 1,
  },
});

module.exports = AudioPlayer;
