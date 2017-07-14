'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDistance = getDistance;
exports.getSwipeGestureName = getSwipeGestureName;
exports.getSwipeEventName = getSwipeEventName;

var _directionTypes = require('../constants/direction-types');

function getDistance(points, x, y) {
  var firstPoint = points[1];
  var zeroPoint = points[0];
  var dX = firstPoint[x] - zeroPoint[x];
  var dY = firstPoint[y] - zeroPoint[y];
  return Math.sqrt(dX * dX + dY * dY);
}

function getSwipeDirectionX(deltaX) {
  return deltaX < 0 ? _directionTypes.RIGHT : _directionTypes.LEFT;
}

function getSwipeDirectionY(deltaY) {
  return deltaY < 0 ? _directionTypes.DOWN : _directionTypes.UP;
}

function getSwipeDirection(deltaX, absX, deltaY, absY) {
  return absX > absY ? getSwipeDirectionX(deltaX) : getSwipeDirectionY(deltaY);
}

function getSwipeGestureName(deltaX, absX, deltaY, absY) {
  return 'swipe' + getSwipeDirection(deltaX, absX, deltaY, absY).toLowerCase();
}

function getSwipeEventName(deltaX, absX, deltaY, absY) {
  return 'onSwipe' + getSwipeDirection(deltaX, absX, deltaY, absY);
}