import React from 'react';
import { touchListMap, distance, getDirection } from '../utils/geture-calculations';
import { isCorrectSwipe, isFocused, isTextSelected } from '../utils/validations';
import {
  initGestureData,
  getEventGesture,
  setEventPinch,
  setGestureType,
  setGestureScrollDelta,
  setEvGestureDetailsPos,
  setEvGestureIsFlick,
} from '../utils/event';
import * as Buttons from '../constants/buttons';

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
  disableClick: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.func,
  ]),
  children: React.PropTypes.element,
};

const defaultProps = {
  flickThreshold: 0.6,
  swipeThreshold: 10,
  holdTime: 400,
  scrollEndTimeout: 200,
};

export default class ReactGesture extends React.Component {

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
      isHold: false,
    };
    this.onRef = this.onRef.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onHoldGesture = this.onHoldGesture.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onScrollEnd = this.onScrollEnd.bind(this);
    this.onClick = this.onClick.bind(this);
    this.disableClick = this.disableClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('touchcancel', this.onTouchCancel);
    window.addEventListener('wheel', this.onWheel);
    this.wrapper.addEventListener('click', this.disableClick, true);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchCancel);
    window.removeEventListener('wheel', this.onWheel);
    this.wrapper.removeEventListener('click', this.disableClick, true);
  }

  onRef(ref) {
    /* if we need to handle dom changes
    if (ref === null) {
      this.wrapper.removeEventListener('click', this.disableClick, true);
    } else {
      this.wrapper = ref;
      this.wrapper.addEventListener('click', this.disableClick, true);
    }
    */
    this.wrapper = ref;
  }

  onTouchStart(e) {
    this.setPSEmpty();
    this.emitEvent('onTouchStart', e);
    this.setPSStartDateNow();
    this.setPSHoldTimerInitIfNeed(e);
    this.setPSPosCurrentTouchDown(e);
    this.setPSPinch(false);
    this.setPSSwiping(false);
    this.setPSFingers(e);
    this.setPSHold(false);
    this.setPSTextSelection(false);
    this.setBeginHandled(true);
    this.touch = true;
  }

  onTouchMove(e) {
    const eventWithGesture = this.getEventWithGesture(e);
    this.emitEvent('onTouchMove', eventWithGesture);
    const pseudoState = this.pseudoState;
    if (pseudoState.x === null || pseudoState.y === null) {
      return;
    }
    const isPinch = e.touches.length === 2;
    const wasPinch = pseudoState.fingers !== undefined &&
      pseudoState.fingers.length === 2;
    if (isPinch) {
      if (wasPinch) {
        this.handlePinch(e);
      }
      this.setPSFingers(e);
      return;
    }
    if (this.isSwipeGesture(eventWithGesture)) {
      this.handleSwipeGesture(eventWithGesture);
      return;
    }
  }

  onTouchCancel(e) {
    this.emitEvent('onTouchCancel', e);
    this.resetState();
  }

  onTouchEnd(e) {
    const eventWithGesture = this.getEventWithGesture(e);
    this.emitEvent('onTouchEnd', eventWithGesture);
    this.setEndHandled(true);
    if (this.getPSSwiping()) {
      this.handleSwipeGesture(eventWithGesture);
      this.resetState();
      return;
    }
    this.resetState();
  }

  onMouseDown(e) {
    if (this.getBeginHandled()) {
      this.setBeginHandled(false);
      return;
    }
    this.setPSEmpty();
    this.emitEvent('onMouseDown', e);
    this.setPSHoldTimerInitIfNeed(e);
    this.setPSStartDateNow();
    this.setPSPosCurrentMouseDown(e);
    this.setPSPinch(false);
    this.setPSSwiping(false);
    this.setPSHold(false);
    this.setPSTextSelection(false);
    this.touch = false;
  }

  onMouseMove(e) {
    const eventWithGesture = this.getEventWithGesture(e);
    this.emitEvent('onMouseMove', eventWithGesture);
    const pseudoState = this.pseudoState;
    const canBeGesture = pseudoState.x !== null && pseudoState.y !== null;
    if (canBeGesture && this.isSwipeGesture(eventWithGesture)) {
      this.handleSwipeGesture(eventWithGesture);
      return;
    }
  }

  onMouseUp(e) {
    if (this.getEndHandled()) {
      this.setEndHandled(false);
      return;
    }
    const eventWithGesture = this.getEventWithGesture(e);
    this.emitEvent('onMouseUp', eventWithGesture);
    if (this.getPSSwiping()) {
      this.handleSwipeGesture(eventWithGesture);
      this.resetState();
      return;
    }
    this.resetState();
  }

  onHoldGesture(e) {
    const pseudoState = this.pseudoState;
    const fingers = pseudoState.fingers;
    if (!this.getPSSwiping() && (!fingers || fingers.length === 1)) {
      this.emitEvent('onHold', e);
      this.setPSHold(true);
    }
  }

  onWheel(e) {
    const eventWithGesture = this.getEventWithGesture(e);
    setGestureScrollDelta(eventWithGesture, e);
    this.emitEvent('onScroll', eventWithGesture);
    this.setPSWheelTimerClearIfNeed();
    this.setPSWheelTimerInit();
  }

  onScrollEnd(e) {
    this.emitEvent('onScrollEnd', e);
    this.setPSWheelTimerClear();
  }

  onClick(e) {
    const type = this.touch ? 'onTap' : 'onClick';
    this.emitEvent(type, e);
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
    const done = e.type === 'touchend' || e.type === 'mouseup';
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
    if ((holdTimer === null || holdTimer === undefined) &&
      (e.button === Buttons.LEFT || e.button === undefined)) {
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

  getPSHold() {
    return this.pseudoState.isHold;
  }

  setPSTextSelection(isSelection) {
    this.pseudoState.textSelection = isSelection;
  }

  getPSTextSelection() {
    return this.pseudoState.textSelection;
  }

  setPSHold(hold) {
    this.pseudoState.isHold = hold;
  }

  setPSEmpty() {
    this.pseudoState = {};
  }

  setBeginHandled(handled) {
    this.beginHandled = handled;
  }

  getBeginHandled() {
    return this.beginHandled;
  }

  setEndHandled(handled) {
    this.endHandled = handled;
  }

  getEndHandled() {
    return this.endHandled;
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

  isTextSelectionGesture(eventWithGesture) {
    if (this.getPSTextSelection()) {
      return true;
    }
    const { target } = eventWithGesture;
    const isSelectionGesture = isFocused(target) && isTextSelected(target);
    if (isSelectionGesture) {
      this.setPSTextSelection(true);
    }
    return isSelectionGesture;
  }

  isSwipeGesture(eventWithGesture) {
    const eventGesture = getEventGesture(eventWithGesture);
    const swipeThreshold = this.props.swipeThreshold;
    return (this.getPSSwiping()
      || eventGesture.absX > swipeThreshold
      || eventGesture.absY > swipeThreshold)
      && !this.isTextSelectionGesture(eventWithGesture);
  }

  disableClick(e) {
    const { disableClick } = this.props;
    const disable = typeof disableClick === 'function' ?
      disableClick(e) : disableClick;

    if (disable === false) {
      return;
    }
    if (disable === undefined &&
      !this.getPSSwiping() && !this.getPSHold()) {
      return;
    }
    e.stopImmediatePropagation();
  }

  resetState() {
    const swipingBackup = this.getPSSwiping();
    const holdBackup = this.getPSHold();
    this.setPSEmpty();
    this.setPSHoldTimerClear();
    this.setPSStartInfinite();
    this.setPSHoldTimerNull();
    this.setPSPosEmpty();
    this.setPSFingersEmpty();
    this.setPSWheelTimerNull();
    this.setPSPinch(false);
    this.setPSSwiping(swipingBackup);
    this.setPSHold(holdBackup);
    this.setPSTextSelection(false);
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
      ref: this.onRef,
      onTouchStart: this.onTouchStart,
      onMouseDown: this.onMouseDown,
      onClick: this.onClick,
    });
  }
}

ReactGesture.propTypes = propTypes;
ReactGesture.defaultProps = defaultProps;
