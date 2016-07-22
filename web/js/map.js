(function(){
  var Fringe = {

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
        points.push(Fringe.drawCircle(locations[key], markerStyle));
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
        var coordinates = this.points[this.activeKey - 1].getLatLng();
        this.activePoint = this.drawCircle({coordinates: coordinates}, {color: '#aaaaaa', radius: 15});
      }
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

    Fringe.updateActiveMarker();

  }

  //if (typeof(WebViewBridge)==='undefined') {
    //var locations = { 1: { "key": "1", "coordinates": [53.335703727844745, -6.317653656005859], "audio": "tr1.mp3" }, 2: { "key": "2", "coordinates": [53.33628991496072, -6.317787766456604], "audio": "tr2.mp3" }, 3: { "key": "3", "coordinates": [53.337157969606594, -6.317964792251586], "audio": "tr2.mp3" }, 4: { "key": "4", "coordinates": [53.337087500884664, -6.318884789943695], "audio": "tr1.mp3" }, 5: { "key": "5", "coordinates": [53.33704105552701, -6.319767236709595], "audio": "tr1.mp3" }, 6: { "key": "6", "coordinates": [53.33705386804451, -6.320660412311554], "audio": "tr1.mp3" }, 7: { "key": "7", "coordinates": [53.33677999964457, -6.320858895778656], "audio": "tr1.mp3" }, 8: { "key": "8", "coordinates": [53.33672394449211, -6.320300996303558], "audio": "tr1.mp3" }, 9: { "key": "9", "coordinates": [53.33796354694951, -6.3181284070014945], "audio": "tr1.mp3" }, 10: { "key": "10", "coordinates": [53.338687432496066, -6.318273246288299], "audio": "tr1.mp3" }, 11: { "key": "11", "coordinates": [53.33842318366521, -6.319131553173065], "audio": "tr1.mp3" }, 12: { "key": "12", "coordinates": [53.33821178342168, -6.319834291934966], "audio": "tr1.mp3" }, 13: { "key": "13", "coordinates": [53.33795233623601, -6.320716738700866], "audio": "tr1.mp3" }, 14: { "key": "14", "coordinates": [53.337800190547306, -6.321306824684143], "audio": "tr1.mp3" }, 15: { "key": "15", "coordinates": [53.33748148360846, -6.321805715560912], "audio": "tr1.mp3" }, };
    //Fringe.drawDots(locations);
  //}
  //F = Fringe;

})();
