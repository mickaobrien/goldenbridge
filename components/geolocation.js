'use strict';

import React from 'react';
import TimerMixin from 'react-timer-mixin';

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

  componentDidMount: function() {
    this.setInterval(this.getPosition, 500);
    //this.watchID = navigator.geolocation.watchPosition((position) => {
        //this.props.onPositionUpdate(position);
        //this.setState({position});
      //},
      //(error) => {
        //console.log('watchPosition error: ' + error.message);
      //},
      //{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 2}
    //);
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render: function() {
    return false;
  }
});

module.exports = Geolocation;
