function log(s) {
    document.querySelector('#console').innerText = s;
}

(function(){
    var Fringe = {

        init: function() {
            L.mapbox.accessToken = 'pk.eyJ1IjoiLW1pY2stIiwiYSI6InBoM0pvdXMifQ.cZxAMQ7D-nENcB5SPagqpg';
            this.drawMap();
        },

        drawMap: function() {
            var map = L.mapbox.map('map');
            map.zoomControl.removeFrom(map);
            //map.setView([53.33570, -6.317653656005859], 16);
            map.setView([53.336981, -6.319574], 16);

            //map.zoomControl = false;
            //this.disableInteractivity(map);
            //var stamenLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
                  //attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
            //}).addTo(map);
            var customLayer = L.mapbox.tileLayer('-mick-.j15dkof3', {
                  attribution: 'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
            }).addTo(map);

            this.map = map;
        },

        disableInteractivity: function(map) {
            //Disable drag and zoom handlers.
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();

            // Disable tap handler, if present.
            if (map.tap) map.tap.disable();
        },

        drawCircle: function(location) {
            var color = location.visited ? 'gray' : 'pink';
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
        var locations = JSON.parse(message);
        Fringe.drawDots(locations);
    }

})();
