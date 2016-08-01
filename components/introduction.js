'use strict';

import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Link} from './link';

var IntroductionScreen = React.createClass({
  startApp() {
    this.props.navigator.push(this.props.nextScreen);
  },

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.titlebar}>
          <Text style={styles.title}>Echoes From The Past</Text>
        </View>
        <View style={styles.textcontent}>
          <Text style={styles.paragraph}>
            Echoes from the Past is a location triggered audio guide which uses the findings of the 2009 Report of the Commission to Inquire into Child Abuse (the Ryan Report) to explore the former site of St. Vincent’s Industrial School.
          </Text>
          <Text style={styles.paragraph}>
              St. Vincent’s Industrial School, more commonly known as “Goldenbridge”, was an industrial school in Dublin run by the Sisters of Mercy. Originally founded as a rehabilitation service for female prisoners, the site was converted to an industrial school for girls in 1883. The number of residents fluctuated over the decades reaching a peak of 193 in 1964. The school closed in 1983 and the buildings have since been demolished. Experiences of ex-residents of Goldenbridge featured in a number of television and radio programmes such as ‘Dear Daughter’ and ‘States of Fear’ and some ex-residents were prominent in the campaign for redress. The screening of these programmes provoked a huge public reaction, and was followed by an apology by the Taoiseach and the establishment of the Commission to Inquire into Child Abuse in 2000.
          </Text>
          <Text style={styles.paragraph}>
              This audio guide is designed to give the user a sense of the common experiences had by ex-residents of the industrial school using direct testimonial statements from the Ryan Report. The Report is publicly accessible at the following link: www.childabusecommission.ie
          </Text>
          <Text style={styles.paragraph}>
            Echoes from the Past is part of a two-year project Industrial Memories analysing the
            findings of the 2009 Ryan Report funded by the Irish Research Council under New Horizon 2015
            (for further information see the <Link style={styles.paragraph} url='http://irishmemorystudies.com/index.php/industrial-memories/' text='Industrial Memories website' />).
          </Text>
          <Text style={styles.paragraph}>
            For more information on Goldenbridge Industrial School and a downloadable version of the audio see please visit ......(WORDPRESS website which Maeve will create this week)
          </Text>
          <TouchableHighlight style={styles.button}
            onPress={this.startApp}>
            <Text style={styles.buttonText}>
              BEGIN  <Icon style={styles.buttonIcon} name={'chevron-right'} />
            </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titlebar: {
    alignSelf: 'stretch',
    backgroundColor: '#0A1E3F',
    padding: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: '#B9C7D4',
  },
  textcontent: {
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  paragraph: {
    fontSize: 20,
    marginTop: 4,
    marginBottom: 6,
  },
  button: {
    margin: 24,
    marginLeft: 64,
    marginRight: 64,
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

module.exports = IntroductionScreen;
