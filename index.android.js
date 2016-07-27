'use strict';

import React, { Component } from 'react';
import Goldenbridge from './components/goldenbridge';
import HomeScreen from './components/homescreen';
import IntroductionScreen from './components/introduction';
import {
  AppRegistry,
  Navigator,
  Platform,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }

var App = React.createClass({

  getInitialState() {
    return {
      appScreen: {name: 'app'},
      introScreen: {name: 'introduction'},
      homeScreen: {name: 'home'},
    };
  },

  renderScene(route, navigator) {
    switch(route.name) {
      case 'app':
        return <Goldenbridge navigator={navigator} nextScreen={this.state.appScreen}/>;

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
      />
    );
  }
});


AppRegistry.registerComponent('Goldenbridge', () => App);
