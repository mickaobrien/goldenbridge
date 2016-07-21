'use strict';

import React from 'react';

var Geolocation = React.createClass({
  watchID: (null: ?number),

  componentDidMount: function() {
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        this.props.onPositionUpdate(position);
        this.setState({position});
      },
      (error) => {
        console.log('watchPosition error: ' + error.message);
      },
      {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000, distanceFilter: 1}
    );
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render: function() {
    return false;
  }
});

module.exports = Geolocation;
