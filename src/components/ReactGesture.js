import React from 'react';
import autobind from 'autobind-decorator';
import { touchListMap, distance, getDirection } from '../utils/geture-calculations';
import { isCorrectSwipe } from '../utils/validations';
import {
  initGestureData,
  getEventGesture,
  setEventPinch,
  setGestureType,
  setGestureScrollDelta,
  setEvGestureDetailsPos,
  setEvGestureIsFlick,
} from '../utils/event';

const propTypes = {
  onSwipeUp: React.PropTypes.func,
  onSwipeDown: React.PropTypes.func,
  onSwipeLeft: React.PropTypes.func,
  onSwipeRight: React.PropTypes.func,
  onTap: React.PropTypes.func,
  onClick: React.PropTypes.func,
  onHold: React.PropTypes.func,
  onPinchToZoom: React.PropTypes.func,
  onTouchStart: React.PropTypes.func,
  onTouchMove: React.PropTypes.func,
  onTouchCancel: React.PropTypes.func,
  onTouchEnd: React.PropTypes.func,
  onMouseDown: React.PropTypes.func,
  onMouseMove: React.PropTypes.func,
  onMouseUp: React.PropTypes.func,
  onScroll: React.PropTypes.func,
  onScrollEnd: React.PropTypes.func,
  flickThreshold: React.PropTypes.number,
  swipeThreshold: React.PropTypes.number,
  holdTime: React.PropTypes.number,
  scrollEndTimeout: React.PropTypes.number,
  children: React.PropTypes.element,
};

const defaultProps = {
  flickThreshold: 0.6,
  swipeThreshold: 10,
  holdTime: 400,
  scrollEndTimeout: 200,
};

export class ReactGesture extends React.Component {

  constructor(props) {
    super(props);

    this.pseudoState = {
      x: null,
      y: null,
      swiping: false,
      swipingDirection: undefined,
      pinch: false,
      start: 0,
      holdTimer: null,
      wheelTimer: null,
      fingers: [],
    };

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('touchcancel', this.onTouchCancel);
    window.addEventListener('wheel', this.onWheel);
  }

  @autobind
  onTouchStart(e) {
    e.preventDefault();
    this.setPSEmpty();
    this.emitEvent('onTouchStart', e);
    this.setPSStartDateNow();
    this.setPSHoldTimerInitIfNeed(e);
    this.setPSPosCurrentTouchDown(e);
    this.setPSPinch(false);
    this.setPSSwiping(false);
    this.setPSFingers(e);
  }

  @autobind
  onTouchMove(e) {
    e.preventDefault();
    const eventWithGesture = this.getEventWithGesture(e);
    this.emitEvent('onTouchMove', eventWithGesture);
    const pseudoState = this.pseudoState;
    if (pseudoState.x === null || pseudoState.y === null) {
      return;
    }
    const isPinch = e.touches.length === 2;
    const wasPinch = pseudoState.fingers.length === 2;
    if (isPinch) {
      if (wasPinch) {
        this.handlePinch(e);
      }
      this.setPSFingers(e);
      return;
    }
    const eventGesture = getEventGesture(eventWithGesture);
    if (this.isSwipeGesture(eventGesture)) {
      this.handleSwipeGesture(eventWithGesture);
      return;
    }
  }

  @autobind
  onTouchCancel(e) {
    this.emitEvent('onTouchCancel', e);
    this.resetState();
  }

  @autobind
  onTouchEnd(e) {
    const eventWithGesture = this.getEventWithGesture(e);
    this.emitEvent('onTouchEnd', eventWithGesture);
    if (this.getPSSwiping()) {
      this.handleSwipeGesture(eventWithGesture);
      this.resetState();
      return;
    }
    if (this.isTapOrClickGesture(eventWithGesture)) {
      this.handleTapGesture(eventWithGesture);
      this.resetState();
      return;
    }
    this.resetState();
  }

  @autobind
  onMouseDown(e) {
    this.setPSEmpty();
    this.emitEvent('onMouseDown', e);
    this.setPSHoldTimerInit(e);
    this.setPSStartDateNow();
    this.setPSPosCurrentMouseDown(e);
    this.setPSPinch(false);
    this.setPSSwiping(false);
  }

  @autobind
  onMouseMove(e) {
    const eventWithGesture = this.getEventWithGesture(e);
    this.emitEvent('onMouseMove', eventWithGesture);
    const pseudoState = this.pseudoState;
    const canBeGesture = pseudoState.x !== null && pseudoState.y !== null;
    if (canBeGesture && this.isSwipeGesture(getEventGesture(eventWithGesture))) {
      this.handleSwipeGesture(eventWithGesture);
      return;
    }
  }

  @autobind
  onMouseUp(e) {
    const eventWithGesture = this.getEventWithGesture(e);
    this.emitEvent('onMouseUp', eventWithGesture);
    if (this.getPSSwiping()) {
      this.handleSwipeGesture(eventWithGesture);
      this.resetState();
      return;
    }
    if (this.isTapOrClickGesture(eventWithGesture)) {
      this.handleClickGesture(eventWithGesture);
      this.resetState();
      return;
    }
    this.resetState();
  }

  @autobind
  onHoldGesture(e) {
    const pseudoState = this.pseudoState;
    const fingers = pseudoState.fingers;
    if (!this.getPSSwiping() && (!fingers || fingers.length === 1)) {
      this.emitEvent('onHold', e);
    }
  }

  @autobind
  onWheel(e) {
    const eventWithGesture = this.getEventWithGesture(e);
    setGestureScrollDelta(eventWithGesture, e);
    this.emitEvent('onScroll', eventWithGesture);
    this.setPSWheelTimerClearIfNeed();
    this.setPSWheelTimerInit();
  }

  @autobind
  onScrollEnd(e) {
    this.emitEvent('onScrollEnd', e);
    this.setPSWheelTimerClear();
  }

  getEventWithGesture(e) {
    const changedTouches = e.changedTouches;
    const { clientX, clientY } = changedTouches ? changedTouches[0] : e;
    const pseudoState = this.pseudoState;
    const deltaX = pseudoState.x - clientX;
    const deltaY = pseudoState.y - clientY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const duration = Date.now() - pseudoState.start;
    const velocity = Math.sqrt(absX * absX + absY * absY) / duration;
    const velocityX = absX / duration;
    const velocityY = absY / duration;
    const done = e.type === 'touchend';
    initGestureData(
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
    );
    return e;
  }

  getInitHoldTimer(e) {
    return setTimeout(this.onHoldGesture, this.props.holdTime, e);
  }

  setGestureIsFlick(eventWithGesture) {
    const eventGesture = getEventGesture(eventWithGesture);
    setEvGestureIsFlick(eventGesture, eventGesture.velocity > this.props.flickThreshold);
  }

  setGestureDetailsPos(eventWithGesture) {
    const pseudoState = this.pseudoState;
    setEvGestureDetailsPos(eventWithGesture, pseudoState.x, pseudoState.y);
  }

  getPSSwiping() {
    return this.pseudoState.swiping;
  }

  getPSSwipingDirection() {
    return this.pseudoState.swipingDirection;
  }

  setPSFingers(e) {
    this.pseudoState.fingers = touchListMap(e.touches);
  }

  setPSFingersEmpty() {
    this.pseudoState.fingers = [];
  }

  setPSHoldTimerInitIfNeed(e) {
    const pseudoState = this.pseudoState;
    let holdTimer = pseudoState.holdTimer;
    if (holdTimer === null || holdTimer === undefined) {
      holdTimer = this.getInitHoldTimer(e);
    }
    pseudoState.holdTimer = holdTimer;
  }

  setPSHoldTimerClear() {
    clearTimeout(this.pseudoState.holdTimer);
  }

  setPSHoldTimerInit(e) {
    this.pseudoState.holdTimer = this.getInitHoldTimer(e);
  }

  setPSHoldTimerNull() {
    this.pseudoState.holdTimer = null;
  }

  setPSStartDateNow() {
    this.pseudoState.start = Date.now();
  }

  setPSStartInfinite() {
    this.pseudoState.start = Number.POSITIVE_INFINITY;
  }

  setPSPinch(pinch) {
    this.pseudoState.pinch = pinch;
  }

  setPSPosEmpty() {
    const pseudoState = this.pseudoState;
    pseudoState.x = null;
    pseudoState.y = null;
  }

  setPSPosCurrentMouseDown(e) {
    const pseudoState = this.pseudoState;
    pseudoState.x = e.clientX;
    pseudoState.y = e.clientY;
  }

  setPSPosCurrentTouchDown(e) {
    const pseudoState = this.pseudoState;
    const touches = e.touches;
    const firstTouche = touches[0];
    pseudoState.x = firstTouche.clientX;
    pseudoState.y = firstTouche.clientY;
  }

  setPSSwiping(swiping) {
    this.pseudoState.swiping = swiping;
  }

  setPSSwipingDirection(swipingDirection) {
    this.pseudoState.swipingDirection = swipingDirection;
  }

  setPSWheelTimerInit() {
    this.pseudoState.wheelTimer = setTimeout(this.onScrollEnd, this.props.scrollEndTimeout);
  }

  setPSWheelTimerClear() {
    clearTimeout(this.pseudoState.wheelTimer);
  }

  setPSWheelTimerNull() {
    this.pseudoState.wheelTimer = null;
  }

  setPSWheelTimerClearIfNeed() {
    const pseudoStateWheelTimer = this.pseudoState.wheelTimer;
    if (pseudoStateWheelTimer) {
      clearTimeout(pseudoStateWheelTimer);
    }
  }

  setPSEmpty() {
    this.pseudoState = {};
  }

  handlePinch(e) {
    this.setPSPinch(true);
    const pseudoState = this.pseudoState;
    const fingers = pseudoState.fingers;
    const prevDist = distance(fingers);
    const currDist = distance(e.touches, 'clientX', 'clientY');
    const scale = currDist / prevDist;
    const zeroFinger = fingers[0];
    const firstFinger = fingers[1];
    const origin = {
      x: (zeroFinger.x + firstFinger.x) / 2,
      y: (zeroFinger.y + firstFinger.y) / 2,
    };
    setEventPinch(e, scale, origin);
    this.emitEvent('onPinchToZoom', e);
  }

  handleTapGesture(eventWithGesture) {
    setGestureType(eventWithGesture, 'tap');
    this.setGestureDetailsPos(eventWithGesture);
    this.emitEvent('onTap', eventWithGesture);
  }

  handleClickGesture(eventWithGesture) {
    setGestureType(eventWithGesture, 'click');
    this.emitEvent('onClick', eventWithGesture);
  }

  handleSwipeGesture(eventWithGesture) {
    const eventGesture = getEventGesture(eventWithGesture);
    const { deltaX, absX, deltaY, absY } = eventGesture;
    const direction = getDirection(deltaX, absX, deltaY, absY);
    if (!this.getPSSwiping()) {
      this.setPSSwiping(true);
      this.setPSSwipingDirection((absX > absY) ? 'x' : 'y');
    }
    const swipingDirection = this.getPSSwipingDirection();
    if (isCorrectSwipe(swipingDirection, absX, absY)) {
      eventWithGesture.preventDefault();
      this.setGestureIsFlick(eventWithGesture);
      setGestureType(eventWithGesture, `swipe${direction.toLowerCase()}`);
      this.emitEvent(`onSwipe${direction}`, eventWithGesture);
    }
  }

  isSwipeGesture(eventWithGestureGesture) {
    const swipeThreshold = this.props.swipeThreshold;
    return this.getPSSwiping()
      || eventWithGestureGesture.absX > swipeThreshold
      || eventWithGestureGesture.absY > swipeThreshold;
  }

  isTapOrClickGesture(eventWithGesture) {
    const duration = getEventGesture(eventWithGesture).duration;
    return !this.pseudoState.pinch && duration > 0 && duration < this.props.holdTime;
  }

  resetState() {
    this.setPSEmpty();
    this.setPSHoldTimerClear();
    this.setPSStartInfinite();
    this.setPSHoldTimerNull();
    this.setPSPosEmpty();
    this.setPSFingersEmpty();
    this.setPSWheelTimerNull();
    this.setPSPinch(false);
    this.setPSSwiping(false);
  }

  emitEvent(name, e) {
    const eventMethod = this.props[name];
    if (eventMethod) {
      eventMethod(e);
    }
  }

  render() {
    const element = React.Children.only(this.props.children);
    return React.cloneElement(element, {
      onTouchStart: this.onTouchStart,
      onMouseDown: this.onMouseDown,
    });
  }
}

ReactGesture.propTypes = propTypes;
ReactGesture.defaultProps = defaultProps;
