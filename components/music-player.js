'use strict';

import Sound from 'react-native-sound';

var MusicPlayer = {
  playSound: function(filename, numberOfLoops){
    if (this.sound) {
      this.sound.play();
    }
    var sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        this.sound = null;
      } else { // loaded successfully
        console.log('playing ' + filename + ' successfully');
        sound.setNumberOfLoops(numberOfLoops);
        sound.play()
        this.sound = sound;
      }
    });
  },

  pauseSound: function(filename, loop) {
    this.sound.pause();
  }
}

module.exports = MusicPlayer;
