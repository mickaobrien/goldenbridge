'use strict';

import React from 'react';
import Sound from 'react-native-sound';

var MusicPlayer = React.createClass({
  getInitialState() {
    return {sound: null};
  },

  componentDidMount() {
    this.playSound(this.props.soundFile, -1);
  },

  componentWillUnmount() {
    this.state.sound.stop();
    this.state.sound.release();
  },

  playSound(filename, numberOfLoops) {
    var sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        this.sound = null;
      } else { // loaded successfully
        console.log('playing ' + filename + ' successfully');
        sound.setNumberOfLoops(numberOfLoops);
        sound.play()
        this.setState({sound});
      }
    });
  },

  pause() {
    if (this.state.sound) this.state.sound.pause();
  },

  play() {
    if (this.state.sound) this.state.sound.play();
  },

  render() {
    return false;
  },
});

module.exports = MusicPlayer;
