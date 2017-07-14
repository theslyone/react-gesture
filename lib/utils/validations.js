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

/**
 * We need to use global document object to check whether DOM is focused.
 */
function isFocused(element) {
  /* eslint-disable no-undef */
  return document.activeElement === element;
  /* eslint-enable */
}

function isTextSelected(element) {
  if (element.selectionStart === undefined) {
    return false;
  }
  return element.selectionStart !== element.selectionEnd;
}