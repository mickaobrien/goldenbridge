var Map = {

  init: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiLW1pY2stIiwiYSI6InBoM0pvdXMifQ.cZxAMQ7D-nENcB5SPagqpg';
    this.drawMap();
    var positionStyle = {color: 'blue', radius: 3, fillOpacity: 0.9}
    this.currentPosition = this.drawCircle({coordinates: [0, 0]}, positionStyle);
  },

  drawMap: function() {
    var map = L.mapbox.map('map', '', {maxZoom: 17, minZoom: 16});
    map.zoomControl.removeFrom(map);
    map.setView([53.336981, -6.319574], 16);

    var localTileLayer = L.tileLayer('./tiles/256/{z}/{x}/{y}', {
      attribution: 'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    }).addTo(map);
    var onlineTileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/-mick-/ciqdnbv83000ie4mdhs0szmcs/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken).addTo(map);

    this.map = map;
  },

  drawCircle: function(location, options) {
    var markerOptions = options || {color: 'gray', fillOpacity: '0.9', stroke: false, radius: 5};
    var circle = L.circleMarker(location.coordinates, markerOptions);
    circle.addTo(this.map);
    return circle;
  },

  removeDots: function() {
    if (this.points) {
      var map = this.map;
      this.points.forEach(function(point) {
        map.removeLayer(point);
      });
    }
  },

  drawDots: function(locations) {
    this.removeDots();
    var points = [];
    var markerStyle = {fillOpacity: '0.8', stroke: false, radius: 5};
    Object.keys(locations).forEach(function(key) {
      var color = locations[key].visited ? '#4F4F52' : '#B87333';
      markerStyle.color = color;
      points.push(Map.drawCircle(locations[key], markerStyle));
    });
    this.points = points;
    var bounds = Object.keys(locations).map(function(key) {
      return locations[key].coordinates;
    });
    this.map.fitBounds(bounds);
    this.map.setMaxBounds(bounds);
  },

  activeKey: null,

  activePoint: function() {
    if (this.activeKey) {
      return this.points[this.activeKey - 1];
    } else {
      return null;
    }
  },

  updateActiveMarker: function() {
    if (this.activePoint) {
      this.map.removeLayer(this.activePoint);
    }
    if (this.activeKey) {
      var activePoint = this.locations[this.activeKey];
      var coordinates = activePoint.coordinates;
      this.activePoint = this.drawCircle({coordinates: coordinates}, {color: '#aaaaaa', radius: 15});
    }
  },

}

Map.init();

function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
        if (window[name]) {
            callback(window[name]);
        } else {
            window.setTimeout(arguments.callee, interval);
        }
    }, interval);
}

whenAvailable('WebViewBridge', function() {
  WebViewBridge.onMessage = function(message) {
    var data = JSON.parse(message);
    if (message.indexOf('currentPosition') > -1) {
      var coordinates = [data.currentPosition.latitude, data.currentPosition.longitude];
      Map.currentPosition.setLatLng(coordinates);
      Map.activeKey = data.activeKey;
    } else {
      Map.locations = data;
      Map.drawDots(data);
    }

    Map.updateActiveMarker();

  }
  WebViewBridge.send('ready');
});
