'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

var ProgressBar = React.createClass({

  onStartShouldSetResponder(evt) {
    return true;
  },

  getInitialState() {
    return {width: 0};
  },

  updateProgress(event) {
    var x = event.nativeEvent.locationX;
    var progress = x/this.state.width;
    console.log('click at ' + x/this.state.width);
    this.props.onTap(progress);
  },

  onLayout() {
    this.refs.progressBar.measure((x, y, w, h, px, py) => {
      this.setState({width: w});
    });
  },

  render() {

    return (
      <View style={styles.background} ref="progressBar"
          onStartShouldSetResponder={this.onStartShouldSetResponder}
          onResponderRelease={this.updateProgress}
          onLayout={this.onLayout}>
        <View style={[styles.fill, { width: this.props.progress*this.state.width }]}/>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#bbbbbb',
    height: 20,
    flex: 1,
    //overflow: 'hidden'
  },
  fill: {
    backgroundColor: '#3b5998',
    height: 20
  }
});

module.exports = ProgressBar;
