'use strict';

import React, { Component } from 'react';
import Goldenbridge from './components/goldenbridge';
import HomeScreen from './components/homescreen';
import IntroductionScreen from './components/introduction';
import MusicPlayer from './components/music-player';
import {
  AppRegistry,
  AppState,
  Navigator,
  Platform,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }

var App = React.createClass({

  getInitialState() {
    return {
      appScreen: {name: 'app'},
      introScreen: {name: 'introduction'},
      homeScreen: {name: 'home'},
      appState: null,
    };
  },

  componentDidMount() {
    AppState.addEventListener('change', this._handleStateChange);
  },

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleStateChange);
  },

  _handleStateChange: function(appState) {
    this.setState({appState: AppState.currentState});
  },

  renderScene(route, navigator) {
    switch(route.name) {
      case 'app':
        return <Goldenbridge navigator={navigator}
                  nextScreen={this.state.appScreen}
                  appState={this.state.appState}/>;

      case 'introduction':
        return <IntroductionScreen navigator={navigator} nextScreen={this.state.appScreen}/>;

      case 'home':
        return <HomeScreen navigator={navigator} nextScreen={this.state.introScreen}/>;
    }
  },

  render() {
    return (
      <Navigator
        initialRoute={{name: 'home'}}
        renderScene={this.renderScene}
        navigationBar={<MusicPlayer soundFile='music.ogg' appState={this.state.appState}/>}
      />
    );
  }
});


AppRegistry.registerComponent('Goldenbridge', () => App);
