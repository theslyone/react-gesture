'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCorrectSwipe = isCorrectSwipe;
exports.isFocused = isFocused;
exports.isTextSelected = isTextSelected;
function isCorrectSwipe(swipingDirection, absX, absY) {
  return swipingDirection === 'x' && absX > absY || swipingDirection === 'y' && absY > absX;
}

function isFocused(element) {
  return document.activeElement === element;
}

function isTextSelected(element) {
  if (element.selectionStart === undefined) {
    return false;
  }
  return element.selectionStart !== element.selectionEnd;
}