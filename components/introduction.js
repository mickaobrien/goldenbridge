'use strict';

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

var IntroductionScreen = React.createClass({
  startApp() {
    this.props.navigator.push(this.props.nextScreen);
  },

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.titlebar}>
          <Text style={styles.title}>Echoes from the Past: Goldenbridge Industrial School</Text>
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
            Echoes from the Past is part of a two-year project Industrial Memories analysing the findings of the 2009 Ryan Report funded by the Irish Research Council under New Horizon 2015 (for further information http://irishmemorystudies.com/index.php/industrial-memories/). For more information on Goldenbridge Industrial School and a downloadable version of the audio see please visit ......(WORDPRESS website which Maeve will create this week)
          </Text>
        </View>
        <TouchableHighlight onPress={this.startApp}>
          <Text>Hello!</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titlebar: {
    backgroundColor: 'gray',
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    color: 'white',
  },
  textcontent: {
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  paragraph: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 6,
  },
});

module.exports = IntroductionScreen;
