
export function isCorrectSwipe(swipingDirection, absX, absY) {
  return (swipingDirection === 'x' && absX > absY) || (swipingDirection === 'y' && absY > absX);
}

/**
 * We need to use global document object to check whether DOM is focused.
 */
export function isFocused(element) {
  /* eslint-disable no-undef */
  return document.activeElement === element;
  /* eslint-enable */
}

export function isTextSelected(element) {
  if (element.selectionStart === undefined) {
    return false;
  }
  return element.selectionStart !== element.selectionEnd;
}
