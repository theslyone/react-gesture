"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGestureData = initGestureData;
exports.getEventGesture = getEventGesture;
exports.setEventPinch = setEventPinch;
exports.setGestureType = setGestureType;
exports.setEvGestureDetailsPos = setEvGestureDetailsPos;
exports.setEvGestureIsFlick = setEvGestureIsFlick;
function initGestureData(e, deltaX, deltaY, absX, absY, velocity, velocityX, velocityY, duration, done) {
  e.gesture = {
    deltaX: deltaX,
    deltaY: deltaY,
    absX: absX,
    absY: absY,
    velocity: velocity,
    velocityX: velocityX,
    velocityY: velocityY,
    duration: duration,
    done: done
  };
}

function getEventGesture(e) {
  return e.gesture;
}

function setEventPinch(e, scale, origin) {
  e.pinch = {
    scale: scale,
    origin: origin
  };
}

function setGestureType(eventWithGesture, gestureType) {
  eventWithGesture.gesture.type = gestureType;
}

function setEvGestureDetailsPos(eventWithGesture, clientX, clientY) {
  eventWithGesture.clientX = clientX;
  eventWithGesture.clientY = clientY;
}

function setEvGestureIsFlick(eventGesture, isFlick) {
  eventGesture.isFlick = isFlick;
}