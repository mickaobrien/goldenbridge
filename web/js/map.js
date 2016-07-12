(function(){
  var Fringe = {

    init: function() {
      L.mapbox.accessToken = 'pk.eyJ1IjoiLW1pY2stIiwiYSI6InBoM0pvdXMifQ.cZxAMQ7D-nENcB5SPagqpg';
      this.drawMap();
    },

    drawMap: function() {
      var map = L.mapbox.map('map', '', {maxZoom: 17, minZoom: 16});
      //var map = L.mapbox.map('map');
      //map.zoomControl.removeFrom(map);
      map.setView([53.336981, -6.319574], 16);

      var customLayer = L.tileLayer('https://api.mapbox.com/styles/v1/-mick-/ciqdnbv83000ie4mdhs0szmcs/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiLW1pY2stIiwiYSI6InBoM0pvdXMifQ.cZxAMQ7D-nENcB5SPagqpg', {
        attribution: 'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
      }).addTo(map);

      this.map = map;
    },

    drawCircle: function(location, color) {
      if (!color) {
        var color = location.visited ? 'gray' : 'pink';
      }
      var markerOptions = {color: color, fillOpacity: '0.9', stroke: false, radius: 5};
      var circle = L.circleMarker(location.coordinates, markerOptions);
      circle.addTo(this.map);
    },

    drawDots: function(locations) {
      Object.keys(locations).forEach(function(key) {
        Fringe.drawCircle(locations[key]);
      });
      var bounds = Object.keys(locations).map(function(key) {
        return locations[key].coordinates;
      });
      this.map.fitBounds(bounds);
    },

  }

  Fringe.init();
  WebViewBridge.send('ready');

  WebViewBridge.onMessage = function(message) {
    var data = JSON.parse(message);
    if (message.indexOf('currentPosition') > -1) {
      var coordinates = [data.currentPosition.latitude, data.currentPosition.longitude];
      Fringe.drawCircle({coordinates: coordinates}, 'blue');
    } else {
      Fringe.drawDots(data);
    }
  }

})();
