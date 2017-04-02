
export function initGestureData(
  e,
  deltaX,
  deltaY,
  absX,
  absY,
  velocity,
  velocityX,
  velocityY,
  duration,
  done
) {
  e.gesture = {
    deltaX,
    deltaY,
    absX,
    absY,
    velocity,
    velocityX,
    velocityY,
    duration,
    done,
  };
}

export function getEventGesture(e) {
  return e.gesture;
}

export function setEventPinch(e, scale, origin) {
  e.pinch = {
    scale,
    origin,
  };
}

export function setGestureType(eventWithGesture, gestureType) {
  eventWithGesture.gesture.type = gestureType;
}

export function setEvGestureDetailsPos(eventWithGesture, clientX, clientY) {
  eventWithGesture.clientX = clientX;
  eventWithGesture.clientY = clientY;
}

export function setEvGestureIsFlick(eventGesture, isFlick) {
  eventGesture.isFlick = isFlick;
}
