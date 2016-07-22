(function(){
  var Fringe = {

    init: function() {
      L.mapbox.accessToken = 'pk.eyJ1IjoiLW1pY2stIiwiYSI6InBoM0pvdXMifQ.cZxAMQ7D-nENcB5SPagqpg';
      this.drawMap();
      this.currentPosition = this.drawCircle({coordinates: [0, 0]}, 'blue');
    },

    drawMap: function() {
      var map = L.mapbox.map('map', '', {maxZoom: 17, minZoom: 16});
      //var map = L.mapbox.map('map');
      map.zoomControl.removeFrom(map);
      map.setView([53.336981, -6.319574], 16);

      var localTileLayer = L.tileLayer('./tiles/256/{z}/{x}/{y}', {
        attribution: 'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
      }).addTo(map);
      var onlineTileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/-mick-/ciqdnbv83000ie4mdhs0szmcs/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken).addTo(map);

      this.map = map;
    },

    drawCircle: function(location, color) {
      if (!color) {
        var color = location.visited ? '#4F4F52' : '#B87333';
      }
      var markerOptions = {color: color, fillOpacity: '0.9', stroke: false, radius: 5};
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
      Object.keys(locations).forEach(function(key) {
        points.push(Fringe.drawCircle(locations[key]));
      });
      this.points = points;
      var bounds = Object.keys(locations).map(function(key) {
        return locations[key].coordinates;
      });
      this.map.fitBounds(bounds);
    },

    activeKey: null,

    markActive: function(point) {
      point.setRadius(8);
    },

  }

  Fringe.init();
  WebViewBridge.send('ready');

  WebViewBridge.onMessage = function(message) {
    var data = JSON.parse(message);
    if (message.indexOf('currentPosition') > -1) {
      var coordinates = [data.currentPosition.latitude, data.currentPosition.longitude];
      Fringe.currentPosition.setLatLng(coordinates);
      Fringe.activeKey = data.activeKey;
    } else {
      Fringe.drawDots(data);
    }

    Fringe.points.forEach(function(point) { point.setRadius(5); });
    if (Fringe.activeKey) {
      Fringe.markActive(Fringe.points[data.activeKey-1]);
    }
  }

  //if (typeof(WebViewBridge)==='undefined') {
    //var locations = { 1: { "key": "1", "coordinates": [53.335703727844745, -6.317653656005859], "audio": "tr1.mp3" }, 2: { "key": "2", "coordinates": [53.33628991496072, -6.317787766456604], "audio": "tr2.mp3" }, 3: { "key": "3", "coordinates": [53.337157969606594, -6.317964792251586], "audio": "tr2.mp3" }, 4: { "key": "4", "coordinates": [53.337087500884664, -6.318884789943695], "audio": "tr1.mp3" }, 5: { "key": "5", "coordinates": [53.33704105552701, -6.319767236709595], "audio": "tr1.mp3" }, 6: { "key": "6", "coordinates": [53.33705386804451, -6.320660412311554], "audio": "tr1.mp3" }, 7: { "key": "7", "coordinates": [53.33677999964457, -6.320858895778656], "audio": "tr1.mp3" }, 8: { "key": "8", "coordinates": [53.33672394449211, -6.320300996303558], "audio": "tr1.mp3" }, 9: { "key": "9", "coordinates": [53.33796354694951, -6.3181284070014945], "audio": "tr1.mp3" }, 10: { "key": "10", "coordinates": [53.338687432496066, -6.318273246288299], "audio": "tr1.mp3" }, 11: { "key": "11", "coordinates": [53.33842318366521, -6.319131553173065], "audio": "tr1.mp3" }, 12: { "key": "12", "coordinates": [53.33821178342168, -6.319834291934966], "audio": "tr1.mp3" }, 13: { "key": "13", "coordinates": [53.33795233623601, -6.320716738700866], "audio": "tr1.mp3" }, 14: { "key": "14", "coordinates": [53.337800190547306, -6.321306824684143], "audio": "tr1.mp3" }, 15: { "key": "15", "coordinates": [53.33748148360846, -6.321805715560912], "audio": "tr1.mp3" }, };
    //Fringe.drawDots(locations);
  //}

})();
