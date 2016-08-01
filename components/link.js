'use strict';

import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
} from 'react-native';

var Link = React.createClass({
  _openLink() {
    Linking.openURL(this.props.url);
  },

  render() {
    return (
      <Text style={styles.link} onPress={this._openLink}>
        {this.props.text}
      </Text>
    );
  }
});

const styles = StyleSheet.create({
  link: {
    color: '#0A1E3F',
  },
});

export {Link};
