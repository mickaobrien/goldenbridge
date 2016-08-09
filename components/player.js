'use strict';

import ProgressBar from './progress-bar';
import React from 'react';
import {
  LayoutAnimation,
  Platform,
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

  componentDidMount() {
    this.playBackgroundAudio(this.props.background);
  },

  componentWillUnmount() {
    if (this.state.sound) {
      this.state.sound.stop();
      this.state.sound.release();
    }
    if (this.state.background) {
      this.state.background.stop();
      this.state.background.release();
    }
  },

  convertFilename(filename) {
    if (Platform.OS === 'ios') {
      return filename + '.mp3';
    }
    return filename + '.ogg';
  },

  componentWillReceiveProps: function(props) {
    if (!props.sound && this.timer) {
        clearInterval(this.timer);
        this.setState({progress: 0});
        if (this.state.sound) {
          this.state.sound.release();
        }
    }

    if (!props.sound || props.sound == this.props.sound) return;
    //TODO stop playing audio if !props.sound && this.props.sound
    if (this.state.sound) this.state.sound.stop();
    this.playSpeech(props.sound, props.autoplay);
    //TODO make this a separate method and stop when audio stops
    this.timer = this.setInterval(function() {
      if (this.state.sound) {
        this.state.sound.getCurrentTime((time, isPlaying) => {

          // Set background volume lower if playing
          if (this.state.background) {
            this.state.background.setVolume(1 - 0.4*isPlaying);
          }

          this.setState({
            'currentTime': time,
            'playing': isPlaying,
            'progress': time/this.state.sound.getDuration(),
          });
        });
      }
    }, 100);
  },

  playBackgroundAudio: function(filename) {
    this.loadSound(filename, true, -1, 'background');
  },

  playSpeech: function(filename, autoplay) {
    this.loadSound(filename, autoplay, 0, 'sound');
  },

  loadSound: function(filename, autoplay, numberOfLoops, stateName) {
    numberOfLoops = numberOfLoops || 0;
    filename = this.convertFilename(filename);
    var sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        console.log('duration in seconds: ' + sound.getDuration() +
                    'number of channels: ' + sound.getNumberOfChannels());
        if (Platform.OS === 'ios') { sound.setCategory('Playback'); }
        sound.setNumberOfLoops(numberOfLoops);
        this.setState({[stateName]: sound});
        if (autoplay) {
          this.playSound(sound, numberOfLoops);
        }
      }
    });
  },

  pauseSound: function() {
    if (this.state.sound) {
      this.state.sound.pause();
    }
  },

  //TODO this method is pretty messy now with the arguments
  playSound: function(sound, numberOfLoops) {
    if (sound) {
      sound.play((success) => {
        if (success && numberOfLoops === 0) {
          this.props.onCompletion();
        } else {
          console.log('playback failed');
        }
      });
    }
  },

  playPause: function() {
    if (this.state.sound) {
      this.state.playing ? this.pauseSound() : this.playSound(this.state.sound, 0);
    }
  },

  tapProgressBar(progress) {
    this.state.sound.setCurrentTime(progress*this.state.sound.getDuration());
  },

  render: function() {
    return (
      <View style={[styles.player, !this.props.sound && styles.playerHidden]}>
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
    height: 30,
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
    width: 30,
  },
  playPauseIcon: {
    fontSize: 24,
    margin: 2,
    marginLeft: 6,
    alignItems: 'center',
  },
  progress: {
    flex: 1,
  },
});

module.exports = AudioPlayer;
