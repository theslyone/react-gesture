'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCorrectSwipe = isCorrectSwipe;
function isCorrectSwipe(swipingDirection, absX, absY) {
  return swipingDirection === 'x' && absX > absY || swipingDirection === 'y' && absY > absX;
}