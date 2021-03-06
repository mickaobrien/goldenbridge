'use strict';

import geodist from 'geodist';
import _ from 'lodash';

const MIN_ACCURACY = 20;
const ACTIVE_RADIUS = 15;

function getDistance(l1, l2) {
  var p1 = {lat: l1[0], lon: l1[1]};
  var p2 = {lat: l2[0], lon: l2[1]};
  return geodist(p1, p2, {exact: true, unit: 'meters'});
}

function getNearestPoint(points, currentLocation) {
  var position = currentLocation.coords;
  if (position.accuracy > MIN_ACCURACY) {
    return null;
  }
  var coords = [position.latitude, position.longitude];
  //var points = this.props.points;
  _.forEach(points, function(point, key) {
    point.distance = getDistance(coords, point.coordinates);
  });
  var sortedPoints = _.sortBy(_.values(points), function(point) { return point.distance; });
  var nearestPoint = sortedPoints[0];
  if (nearestPoint.distance < ACTIVE_RADIUS) {
    return nearestPoint.key;
  } else {
    return null;
  }
}

module.exports = getNearestPoint;
