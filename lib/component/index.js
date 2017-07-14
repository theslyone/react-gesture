'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _gestureCalculations = require('../utils/gesture-calculations');

var _validations = require('../utils/validations');

var _event = require('../utils/event');

var _buttons = require('../constants/buttons');

var Buttons = _interopRequireWildcard(_buttons);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global window */


var propTypes = {
  children: _propTypes2.default.element,
  disableClick: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.func]),
  flickThreshold: _propTypes2.default.number,
  holdTime: _propTypes2.default.number,
  swipeThreshold: _propTypes2.default.number,
  onSwipeUp: _propTypes2.default.func,
  onSwipeDown: _propTypes2.default.func,
  onSwipeLeft: _propTypes2.default.func,
  onSwipeRight: _propTypes2.default.func,
  onTap: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onHold: _propTypes2.default.func,
  onPinchToZoom: _propTypes2.default.func,
  onTouchStart: _propTypes2.default.func,
  onTouchMove: _propTypes2.default.func,
  onTouchCancel: _propTypes2.default.func,
  onTouchEnd: _propTypes2.default.func,
  onMouseEnter: _propTypes2.default.func,
  onMouseLeave: _propTypes2.default.func,
  onMouseDown: _propTypes2.default.func,
  onMouseMove: _propTypes2.default.func,
  onMouseUp: _propTypes2.default.func
};

var defaultProps = {
  flickThreshold: 0.6,
  holdTime: 400,
  swipeThreshold: 10,
  onSwipeUp: undefined,
  onSwipeDown: undefined,
  onSwipeLeft: undefined,
  onSwipeRight: undefined,
  onTap: undefined,
  onClick: undefined,
  onHold: undefined,
  onPinchToZoom: undefined,
  onTouchStart: undefined,
  onTouchMove: undefined,
  onTouchCancel: undefined,
  onTouchEnd: undefined,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
  onMouseDown: undefined,
  onMouseMove: undefined,
  onMouseUp: undefined
};

var ReactGesture = function (_React$Component) {
  _inherits(ReactGesture, _React$Component);

  function ReactGesture(props) {
    _classCallCheck(this, ReactGesture);

    var _this = _possibleConstructorReturn(this, (ReactGesture.__proto__ || Object.getPrototypeOf(ReactGesture)).call(this, props));

    _this.pseudoState = {
      x: null,
      y: null,
      swiping: false,
      swipingDirection: undefined,
      pinch: false,
      start: 0,
      holdTimer: null,
      fingers: [],
      isHold: false
    };
    _this.onRef = _this.onRef.bind(_this);
    _this.onTouchStart = _this.onTouchStart.bind(_this);
    _this.onTouchMove = _this.onTouchMove.bind(_this);
    _this.onTouchCancel = _this.onTouchCancel.bind(_this);
    _this.onTouchEnd = _this.onTouchEnd.bind(_this);
    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onMouseMove = _this.onMouseMove.bind(_this);
    _this.onMouseEnter = _this.onMouseEnter.bind(_this);
    _this.onMouseLeave = _this.onMouseLeave.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);
    _this.onHoldGesture = _this.onHoldGesture.bind(_this);
    _this.onClick = _this.onClick.bind(_this);
    _this.disableClick = _this.disableClick.bind(_this);
    return _this;
  }

  _createClass(ReactGesture, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);
      this.wrapper.addEventListener('click', this.disableClick, true);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);
      this.wrapper.removeEventListener('click', this.disableClick, true);
    }
  }, {
    key: 'onRef',
    value: function onRef(ref) {
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
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e) {
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
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      var eventWithGesture = this.getEventWithGesture(e);
      this.emitEvent('onTouchMove', eventWithGesture);
      var pseudoState = this.pseudoState;
      if (pseudoState.x === null || pseudoState.y === null) {
        return;
      }
      var isPinch = e.touches.length === 2;
      var wasPinch = pseudoState.fingers !== undefined && pseudoState.fingers.length === 2;
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
  }, {
    key: 'onTouchCancel',
    value: function onTouchCancel(e) {
      this.emitEvent('onTouchCancel', e);
      this.resetState();
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(e) {
      var eventWithGesture = this.getEventWithGesture(e);
      this.emitEvent('onTouchEnd', eventWithGesture);
      this.setEndHandled(true);
      if (this.getPSSwiping()) {
        this.handleSwipeGesture(eventWithGesture);
        this.resetState();
        return;
      }
      this.resetState();
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(e) {
      if (this.getBeginHandled()) {
        this.setBeginHandled(false);
        return;
      }
      this.setPSEmpty();
      this.emitEvent('onMouseEnter', e);
      this.setPSHoldTimerInitIfNeed(e);
      this.setPSStartDateNow();
      this.setPSPosCurrentMouseDown(e);
      this.setPSPinch(false);
      this.setPSSwiping(false);
      this.setPSHold(false);
      this.setPSTextSelection(false);
      this.touch = false;
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(e) {
      if (this.getBeginHandled()) {
        this.setBeginHandled(false);
        return;
      }
      this.setPSEmpty();
      this.emitEvent('onMouseLeave', e);
      this.setPSHoldTimerInitIfNeed(e);
      this.setPSStartDateNow();
      this.setPSPosCurrentMouseDown(e);
      this.setPSPinch(false);
      this.setPSSwiping(false);
      this.setPSHold(false);
      this.setPSTextSelection(false);
      this.touch = false;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
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
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var eventWithGesture = this.getEventWithGesture(e);
      this.emitEvent('onMouseMove', eventWithGesture);
      var pseudoState = this.pseudoState;
      var canBeGesture = pseudoState.x !== null && pseudoState.y !== null;
      if (canBeGesture && this.isSwipeGesture(eventWithGesture)) {
        this.handleSwipeGesture(eventWithGesture);
        return;
      }
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      if (this.getEndHandled()) {
        this.setEndHandled(false);
        return;
      }
      var eventWithGesture = this.getEventWithGesture(e);
      this.emitEvent('onMouseUp', eventWithGesture);
      if (this.getPSSwiping()) {
        this.handleSwipeGesture(eventWithGesture);
        this.resetState();
        return;
      }
      this.resetState();
    }
  }, {
    key: 'onHoldGesture',
    value: function onHoldGesture(e) {
      var pseudoState = this.pseudoState;
      var fingers = pseudoState.fingers;
      if (!this.getPSSwiping() && (!fingers || fingers.length === 1)) {
        this.emitEvent('onHold', e);
        this.setPSHold(true);
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {
      if (e.button === Buttons.LEFT || e.button === undefined) {
        var type = this.touch ? 'onTap' : 'onClick';
        this.emitEvent(type, e);
      }
    }
  }, {
    key: 'getEventWithGesture',
    value: function getEventWithGesture(e) {
      var changedTouches = e.changedTouches;

      var _ref = changedTouches ? changedTouches[0] : e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;

      var pseudoState = this.pseudoState;
      var deltaX = pseudoState.x - clientX;
      var deltaY = pseudoState.y - clientY;
      var absX = Math.abs(deltaX);
      var absY = Math.abs(deltaY);
      var duration = Date.now() - pseudoState.start;
      var velocity = Math.sqrt(absX * absX + absY * absY) / duration;
      var velocityX = absX / duration;
      var velocityY = absY / duration;
      var done = e.type === 'touchend' || e.type === 'mouseup';
      (0, _event.initGestureData)(e, deltaX, deltaY, absX, absY, velocity, velocityX, velocityY, duration, done);
      return e;
    }
  }, {
    key: 'getInitHoldTimer',
    value: function getInitHoldTimer(e) {
      return setTimeout(this.onHoldGesture, this.props.holdTime, e);
    }
  }, {
    key: 'setGestureIsFlick',
    value: function setGestureIsFlick(eventWithGesture) {
      var eGesture = (0, _event.getEventGesture)(eventWithGesture);
      (0, _event.setEvGestureIsFlick)(eGesture, eGesture.velocity > this.props.flickThreshold);
    }
  }, {
    key: 'setGestureDetailsPos',
    value: function setGestureDetailsPos(eventWithGesture) {
      var pseudoState = this.pseudoState;
      (0, _event.setEvGestureDetailsPos)(eventWithGesture, pseudoState.x, pseudoState.y);
    }
  }, {
    key: 'getPSSwiping',
    value: function getPSSwiping() {
      return this.pseudoState.swiping;
    }
  }, {
    key: 'getPSSwipingDirection',
    value: function getPSSwipingDirection() {
      return this.pseudoState.swipingDirection;
    }
  }, {
    key: 'setPSFingers',
    value: function setPSFingers(e) {
      this.pseudoState.fingers = Array.from(e.touches).map(function (touch) {
        return { x: touch.clientX, y: touch.clientY };
      });
    }
  }, {
    key: 'setPSFingersEmpty',
    value: function setPSFingersEmpty() {
      this.pseudoState.fingers = [];
    }
  }, {
    key: 'setPSHoldTimerInitIfNeed',
    value: function setPSHoldTimerInitIfNeed(e) {
      var pseudoState = this.pseudoState;
      var holdTimer = pseudoState.holdTimer;
      if ((holdTimer === null || holdTimer === undefined) && (e.button === Buttons.LEFT || e.button === undefined)) {
        holdTimer = this.getInitHoldTimer(e);
      }
      pseudoState.holdTimer = holdTimer;
    }
  }, {
    key: 'setPSHoldTimerClear',
    value: function setPSHoldTimerClear() {
      clearTimeout(this.pseudoState.holdTimer);
    }
  }, {
    key: 'setPSHoldTimerNull',
    value: function setPSHoldTimerNull() {
      this.pseudoState.holdTimer = null;
    }
  }, {
    key: 'setPSStartDateNow',
    value: function setPSStartDateNow() {
      this.pseudoState.start = Date.now();
    }
  }, {
    key: 'setPSStartInfinite',
    value: function setPSStartInfinite() {
      this.pseudoState.start = Number.POSITIVE_INFINITY;
    }
  }, {
    key: 'setPSPinch',
    value: function setPSPinch(pinch) {
      this.pseudoState.pinch = pinch;
    }
  }, {
    key: 'setPSPosEmpty',
    value: function setPSPosEmpty() {
      var pseudoState = this.pseudoState;
      pseudoState.x = null;
      pseudoState.y = null;
    }
  }, {
    key: 'setPSPosCurrentMouseDown',
    value: function setPSPosCurrentMouseDown(e) {
      var pseudoState = this.pseudoState;
      pseudoState.x = e.clientX;
      pseudoState.y = e.clientY;
    }
  }, {
    key: 'setPSPosCurrentTouchDown',
    value: function setPSPosCurrentTouchDown(e) {
      var pseudoState = this.pseudoState;
      var touches = e.touches;
      var firstTouche = touches[0];
      pseudoState.x = firstTouche.clientX;
      pseudoState.y = firstTouche.clientY;
    }
  }, {
    key: 'setPSSwiping',
    value: function setPSSwiping(swiping) {
      this.pseudoState.swiping = swiping;
    }
  }, {
    key: 'setPSSwipingDirection',
    value: function setPSSwipingDirection(swipingDirection) {
      this.pseudoState.swipingDirection = swipingDirection;
    }
  }, {
    key: 'getPSHold',
    value: function getPSHold() {
      return this.pseudoState.isHold;
    }
  }, {
    key: 'setPSTextSelection',
    value: function setPSTextSelection(isSelection) {
      this.pseudoState.textSelection = isSelection;
    }
  }, {
    key: 'getPSTextSelection',
    value: function getPSTextSelection() {
      return this.pseudoState.textSelection;
    }
  }, {
    key: 'setPSHold',
    value: function setPSHold(hold) {
      this.pseudoState.isHold = hold;
    }
  }, {
    key: 'setPSEmpty',
    value: function setPSEmpty() {
      this.pseudoState = {};
    }
  }, {
    key: 'setBeginHandled',
    value: function setBeginHandled(handled) {
      this.beginHandled = handled;
    }
  }, {
    key: 'getBeginHandled',
    value: function getBeginHandled() {
      return this.beginHandled;
    }
  }, {
    key: 'setEndHandled',
    value: function setEndHandled(handled) {
      this.endHandled = handled;
    }
  }, {
    key: 'getEndHandled',
    value: function getEndHandled() {
      return this.endHandled;
    }
  }, {
    key: 'handlePinch',
    value: function handlePinch(e) {
      this.setPSPinch(true);
      var pseudoState = this.pseudoState;
      var fingers = pseudoState.fingers;
      var prevDist = (0, _gestureCalculations.getDistance)(fingers, 'x', 'y');
      var currDist = (0, _gestureCalculations.getDistance)(e.touches, 'clientX', 'clientY');
      var scale = currDist / prevDist;
      var zeroFinger = fingers[0];
      var firstFinger = fingers[1];
      var origin = {
        x: (zeroFinger.x + firstFinger.x) / 2,
        y: (zeroFinger.y + firstFinger.y) / 2
      };
      (0, _event.setEventPinch)(e, scale, origin);
      this.emitEvent('onPinchToZoom', e);
    }
  }, {
    key: 'handleSwipeGesture',
    value: function handleSwipeGesture(eventWithGesture) {
      var eGesture = (0, _event.getEventGesture)(eventWithGesture);
      var deltaX = eGesture.deltaX,
          absX = eGesture.absX,
          deltaY = eGesture.deltaY,
          absY = eGesture.absY;

      var swipeGestureName = (0, _gestureCalculations.getSwipeGestureName)(deltaX, absX, deltaY, absY);
      var swipeEventName = (0, _gestureCalculations.getSwipeEventName)(deltaX, absX, deltaY, absY);
      if (!this.getPSSwiping()) {
        this.setPSSwiping(true);
        this.setPSSwipingDirection(absX > absY ? 'x' : 'y');
      }
      var swipingDirection = this.getPSSwipingDirection();
      if ((0, _validations.isCorrectSwipe)(swipingDirection, absX, absY)) {
        // eventWithGesture.preventDefault();
        this.setGestureIsFlick(eventWithGesture);
        (0, _event.setGestureType)(eventWithGesture, swipeGestureName);
        this.emitEvent(swipeEventName, eventWithGesture);
      }
    }
  }, {
    key: 'isTextSelectionGesture',
    value: function isTextSelectionGesture(eventWithGesture) {
      if (this.getPSTextSelection()) {
        return true;
      }
      var target = eventWithGesture.target;

      var isSelectionGesture = (0, _validations.isFocused)(target) && (0, _validations.isTextSelected)(target);
      if (isSelectionGesture) {
        this.setPSTextSelection(true);
      }
      return isSelectionGesture;
    }
  }, {
    key: 'isSwipeGesture',
    value: function isSwipeGesture(eventWithGesture) {
      var eGesture = (0, _event.getEventGesture)(eventWithGesture);
      var swipeThreshold = this.props.swipeThreshold;
      return (eventWithGesture.button === Buttons.LEFT || eventWithGesture.button === undefined) && (this.getPSSwiping() || eGesture.absX > swipeThreshold || eGesture.absY > swipeThreshold) && !this.isTextSelectionGesture(eventWithGesture);
    }
  }, {
    key: 'disableClick',
    value: function disableClick(e) {
      var disableClick = this.props.disableClick;

      var disable = typeof disableClick === 'function' ? disableClick(e) : disableClick;
      if (disable === false) {
        return;
      }
      if (disable === undefined && !this.getPSSwiping() && !this.getPSHold()) {
        return;
      }
      e.stopImmediatePropagation();
    }
  }, {
    key: 'resetState',
    value: function resetState() {
      var swipingBackup = this.getPSSwiping();
      var holdBackup = this.getPSHold();
      this.setPSEmpty();
      this.setPSHoldTimerClear();
      this.setPSStartInfinite();
      this.setPSHoldTimerNull();
      this.setPSPosEmpty();
      this.setPSFingersEmpty();
      this.setPSPinch(false);
      this.setPSSwiping(swipingBackup);
      this.setPSHold(holdBackup);
      this.setPSTextSelection(false);
    }
  }, {
    key: 'emitEvent',
    value: function emitEvent(name, e) {
      var eventMethod = this.props[name];
      if (eventMethod) {
        eventMethod(e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.cloneElement(_react2.default.Children.only(this.props.children), {
        ref: this.onRef,
        onTouchStart: this.onTouchStart,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onMouseDown: this.onMouseDown,
        onClick: this.onClick
      });
    }
  }]);

  return ReactGesture;
}(_react2.default.Component);

exports.default = ReactGesture;


ReactGesture.propTypes = propTypes;
ReactGesture.defaultProps = defaultProps;