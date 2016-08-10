'use strict';

import _ from 'lodash';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var IntroductionModal = React.createClass({
  hideModal: function() {
    this.props.onClose();
  },

  introText: function() {
    if (this.props.visited.length) {
      var numberVisited = _.uniq(this.props.visited).length;
      var numberRemaining = 15 - numberVisited;
      var pts = (numberRemaining > 1) ? 'locations' : 'location';
      return `You have ${numberRemaining} ${pts} left to visit.`;
    } else {
      return 'There are a total of 15 locations to visit.';
    }
  },

  render: function() {
    return (
      <Modal
        visible={this.props.visible}
        animationType={'fade'}
        transparent={true}
        onRequestClose={this.hideModal}
      >
        <View style={styles.modal}>
          <Text style={styles.heading}>Before you start...</Text>
          <View style={styles.textBlock}>
            <Text style={styles.text}>
              This app uses your phone's GPS to trigger audio at certain locations so make sure you have your GPS enabled and your headphones plugged in.
            </Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.text}>
              {this.introText()}
            </Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.text}>
              Walk to the dots on the map to hear the audio.
            </Text>
          </View>
          <TouchableHighlight style={styles.button}
            onPress={this.hideModal}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
});

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(55, 55, 55, 0.95)',
    alignItems: 'center',
    margin: 30,
    marginTop: 80,
    marginBottom: 60,
  },
  heading: {
    color: '#EEEEEE',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
  },
  textBlock: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: '#EEEEEE',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 4,
    backgroundColor: '#B9C7D4',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#0A1E3F',
    margin: 10,
    fontSize: 16,
  },
  emphasis: {
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },
  icon: {
    fontSize: 18,
    margin: 2,
    color: '#FFFFFF',
  },
});

module.exports = IntroductionModal;
