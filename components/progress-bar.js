'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

var ProgressBar = React.createClass({

  getInitialState() {
    return {width: 0};
  },

  onLayout() {
    this.refs.progressBar.measure((x, y, w, h, px, py) => {
        this.setState({width: w});
    });
  },

  render() {

    return (
      <View style={styles.background} ref="progressBar"
            onLayout={this.onLayout}>
        <View style={[styles.fill, { width: this.props.progress*this.state.width }]}/>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#bbbbbb',
    height: 5,
    overflow: 'hidden'
  },
  fill: {
    backgroundColor: '#3b5998',
    height: 5
  }
});

module.exports = ProgressBar;
