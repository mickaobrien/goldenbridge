'use strict';

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

  render: function() {
    return (
      <Modal
        visible={this.props.visible}
        animationType={'fade'}
        transparent={true}
        onRequestClose={this.hideModal}
      >
        <View style={styles.modal}>
          <Text style={styles.heading}>Introduction</Text>
          <View style={styles.textBlock}>
            <Text style={styles.text}>
              This is an introduction to the app. Maybe some background on the project or a link to further information. Whatever you want.
            </Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.text}>
              Walk to the dots on the map to hear the audio.
            </Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.text}>
              Before you start make sure:
            </Text>
            <Text style={styles.bullet}>
              <Icon name={'headphones'} style={styles.icon} /> your <Text style={styles.emphasis}>headphones</Text> are plugged in
            </Text>
            <Text style={styles.bullet}>
              <Icon name={'map-marker'} style={styles.icon}/>   your <Text style={styles.emphasis}>GPS</Text> is enabled
            </Text>
          </View>
          <TouchableHighlight style={styles.button}
            onPress={this.hideModal}>
            <Text style={styles.buttonText}>Let's Begin</Text>
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
    marginTop: 60,
    marginBottom: 60,
  },
  heading: {
    color: '#EEEEEE',
    fontSize: 20,
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
  bullet: {
    color: '#EEEEEE',
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#B9C7D4',
  },
  buttonText: {
    color: '#0A1E3F',
    margin: 10,
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
