'use strict';

import React from 'react';
import TimerMixin from 'react-timer-mixin';
import {Platform} from 'react-native';

var Geolocation = React.createClass({
  mixins: [TimerMixin],

  watchID: (null: ?number),

  getInitialState: function() {
    return {position: 'unknown'};
  },

  getPosition: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.onPositionUpdate(position);
        this.setState({position});
      },
      (error) => {
        console.log('getCurrentPosition error: ' + error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 2}
    );
  },

  watchPosition: function() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.props.onPositionUpdate(position);
      this.setState({position});
    },
    (error) => {
      console.log('watchPosition error: ' + error.message);
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 2}
                                                      );
  },

  componentDidMount: function() {
    // Hacky way to get iOS to update position regularly
    // TODO fix!
    if (Platform.OS === 'ios') {
      this.watchInterval = this.setInterval(this.getPosition, 500);
    } else {
      this.watchPosition();
    }
  },

  componentWillUnmount: function() {
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
    if (this.watchInterval) {
      this.clearInterval(this.watchInterval);
    }
  },

  render: function() {
    return false;
  }
});

module.exports = Geolocation;
