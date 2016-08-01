'use strict';

import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

var HomeScreen = React.createClass({
  startApp() {
    this.props.navigator.push(this.props.nextScreen);
  },

  render() {
    return (
      <Image style={styles.containerImage}
        source={require('../images/map.png')}>
        <StatusBar hidden={Platform.OS === 'ios'} />
        <View style={styles.titlebar}>
          <Text style={styles.title}>Echoes From The Past</Text>
          <Text style={styles.subtitle}>Goldenbridge Industrial School</Text>
        </View>
        <TouchableHighlight style={styles.button}
          onPress={this.startApp}>
          <Text style={styles.buttonText}>
            INTRODUCTION  <Icon style={styles.buttonIcon} name={'chevron-right'} />
          </Text>
        </TouchableHighlight>
      </Image>
    );
  }
});

const styles = StyleSheet.create({
  containerImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
  },
  container: {
    flex: 1,
  },
  titlebar: {
    alignSelf: 'stretch',
    backgroundColor: '#0A1E3F',
    padding: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    color: '#B9C7D4',
    flex: 1,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 24,
    color: '#B9C7D4',
  },
  button: {
    marginTop: 64,
    padding: 16,
    backgroundColor: '#B9C7D4',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#0A1E3F',
    fontSize: 20,
  },
  buttonIcon: {
    fontSize: 16,
  },
});

module.exports = HomeScreen;
