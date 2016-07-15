
export function isCorrectSwipe(swipingDirection, absX, absY) {
  return (swipingDirection === 'x' && absX > absY) || (swipingDirection === 'y' && absY > absX);
}

export function isFocused(element) {
  return document.activeElement === element;
}

export function isTextSelected(element) {
  if (element.selectionStart === undefined) {
    return false;
  }
  return element.selectionStart !== element.selectionEnd;
}
