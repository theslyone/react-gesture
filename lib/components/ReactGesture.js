'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ReactGesture = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _getureCalculations = require('../utils/geture-calculations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var ReactGesture = exports.ReactGesture = (_class = function (_React$Component) {
	_inherits(ReactGesture, _React$Component);

	function ReactGesture(props) {
		_classCallCheck(this, ReactGesture);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactGesture).call(this, props));

		_this.pseudoState = {
			x: null,
			y: null,
			swiping: false,
			pinch: false,
			start: 0,
			holdTimer: null,
			wheelTimer: null,
			fingers: []
		};

		window.addEventListener('mousemove', _this._handleMouseMove);
		window.addEventListener('mouseup', _this._handleMouseUp);
		window.addEventListener('touchmove', _this._handleTouchMove);
		window.addEventListener('touchend', _this._handleTouchEnd);
		window.addEventListener('wheel', _this._handleWheel);
		return _this;
	}

	_createClass(ReactGesture, [{
		key: '_resetState',
		value: function _resetState() {
			clearTimeout(this.pseudoState.holdTimer);
			this.pseudoState = {
				x: null,
				y: null,
				swiping: false,
				pinch: false,
				start: Number.POSITIVE_INFINITY,
				holdTimer: null,
				wheelTimer: null,
				fingers: []
			};
		}
	}, {
		key: '_emitEvent',
		value: function _emitEvent(name, e) {
			if (this.props[name]) {
				this.props[name](e);
			}
		}
	}, {
		key: '_getGestureDetails',
		value: function _getGestureDetails(e) {
			var _ref = e.changedTouches ? e.changedTouches[0] : e;

			var clientX = _ref.clientX;
			var clientY = _ref.clientY;

			var deltaX = this.pseudoState.x - clientX;
			var deltaY = this.pseudoState.y - clientY;
			var absX = Math.abs(deltaX);
			var absY = Math.abs(deltaY);
			var duration = Date.now() - this.pseudoState.start;
			var velocity = Math.sqrt(absX * absX + absY * absY) / duration;
			var done = e.type === 'touchend';

			e.gesture = {
				deltaX: deltaX,
				deltaY: deltaY,
				absX: absX,
				absY: absY,
				velocity: velocity,
				duration: duration,
				done: done
			};

			return e;
		}
	}, {
		key: '_handleTouchStart',
		value: function _handleTouchStart(e) {
			this._emitEvent('onTouchStart', e);

			var holdTimer = this.pseudoState.holdTimer;
			if (holdTimer === null) {
				holdTimer = setTimeout(this._handleHoldGesture.bind(this), this.props.holdTime, e);
			}

			this.pseudoState = {
				start: Date.now(),
				x: e.touches[0].clientX,
				y: e.touches[0].clientY,
				swiping: false,
				pinch: false,
				holdTimer: holdTimer,
				fingers: (0, _getureCalculations.touchListMap)(e.touches, _getureCalculations.getXY)
			};

			e.preventDefault();
		}
	}, {
		key: '_handleTouchMove',
		value: function _handleTouchMove(e) {
			e.preventDefault();
			var gestureDetails = this._getGestureDetails(e);

			this._emitEvent('onTouchMove', gestureDetails);

			if (this.pseudoState.x !== null) {
				if (e.touches.length === 2) {
					if (this.pseudoState.fingers.length === 2) {
						this._handlePinch(e);
					}

					this.pseudoState.fingers = (0, _getureCalculations.touchListMap)(e.touches, _getureCalculations.getXY);

					return;
				}

				if (this.pseudoState.swiping || gestureDetails.gesture.absX > this.props.swipeThreshold || gestureDetails.gesture.absY > this.props.swipeThreshold) {
					this._handleSwipeGesture(gestureDetails);
					return;
				}
			}
		}
	}, {
		key: '_handlePinch',
		value: function _handlePinch(e) {
			this.pseudoState.pinch = true;
			var prevDist = (0, _getureCalculations.distance)(this.pseudoState.fingers);
			var currDist = (0, _getureCalculations.distance)(e.touches, 'clientX', 'clientY');
			var scale = currDist / prevDist;
			var origin = {
				x: (this.pseudoState.fingers[0].x + this.pseudoState.fingers[1].x) / 2,
				y: (this.pseudoState.fingers[0].y + this.pseudoState.fingers[1].y) / 2
			};

			e.pinch = {
				scale: scale,
				origin: origin
			};

			this._emitEvent('onPinchToZoom', e);
		}
	}, {
		key: '_handleTouchCancel',
		value: function _handleTouchCancel(e) {
			this._emitEvent('onTouchCancel', e);
			this._resetState();
		}
	}, {
		key: '_handleTouchEnd',
		value: function _handleTouchEnd(e) {
			var ge = this._getGestureDetails(e);

			this._emitEvent('onTouchEnd', ge);

			if (this.pseudoState.swiping) {
				this._handleSwipeGesture(ge);
				this._resetState();
				return;
			}
			if (!this.pseudoState.pinch && ge.gesture.duration > 0) {
				this._handleTapGesture(ge);
			}
			this._resetState();
		}
	}, {
		key: '_handleTapGesture',
		value: function _handleTapGesture(ge) {
			ge.gesture.type = 'tap';
			// no more fingers on the screen => no position
			ge.clientX = this.pseudoState.x;
			ge.clientY = this.pseudoState.y;
			this._emitEvent('onTap', ge);
		}
	}, {
		key: '_handleMouseDown',
		value: function _handleMouseDown(e) {
			this._emitEvent('onMouseDown', e);

			var holdTimer = setTimeout(this._handleHoldGesture.bind(this), this.props.holdTime, e);

			this.pseudoState = {
				start: Date.now(),
				x: e.clientX,
				y: e.clientY,
				swiping: false,
				pinch: false,
				holdTimer: holdTimer
			};
		}
	}, {
		key: '_handleMouseMove',
		value: function _handleMouseMove(e) {
			var gestureDetails = this._getGestureDetails(e);

			this._emitEvent('onMouseMove', gestureDetails);

			if (this.pseudoState.x !== null && this.pseudoState.y !== null && (this.pseudoState.swiping || gestureDetails.gesture.absX > this.props.swipeThreshold || gestureDetails.gesture.absY > this.props.swipeThreshold)) {
				this._handleSwipeGesture(gestureDetails);
				return;
			}
		}
	}, {
		key: '_handleMouseUp',
		value: function _handleMouseUp(e) {
			var gestureDetails = this._getGestureDetails(e);

			this._emitEvent('onMouseUp', gestureDetails);

			if (this.pseudoState.swiping) {
				this._handleSwipeGesture(gestureDetails);
				this._resetState();
				return;
			}

			if (gestureDetails.gesture.duration > 0) {
				this._handleClickGesture(gestureDetails);
			}

			this._resetState();
		}
	}, {
		key: '_handleClickGesture',
		value: function _handleClickGesture(gestureDetails) {
			gestureDetails.gesture.type = 'click';
			this._emitEvent('onClick', gestureDetails);
		}
	}, {
		key: '_handleSwipeGesture',
		value: function _handleSwipeGesture(gestureDetails) {
			var _gestureDetails$gestu = gestureDetails.gesture;
			var deltaX = _gestureDetails$gestu.deltaX;
			var absX = _gestureDetails$gestu.absX;
			var deltaY = _gestureDetails$gestu.deltaY;
			var absY = _gestureDetails$gestu.absY;

			var direction = (0, _getureCalculations.getDirection)(deltaX, absX, deltaY, absY);

			this.pseudoState.swiping = true;

			gestureDetails.gesture.isFlick = gestureDetails.gesture.velocity > this.props.flickThreshold;
			gestureDetails.gesture.type = 'swipe' + direction.toLowerCase();
			this._emitEvent('onSwipe' + direction, gestureDetails);
			gestureDetails.preventDefault();
		}
	}, {
		key: '_handleHoldGesture',
		value: function _handleHoldGesture(e) {
			if (!this.pseudoState.swiping && (!this.pseudoState.fingers || this.pseudoState.fingers.length === 1)) {
				this._emitEvent('onHold', e);
			}
		}
	}, {
		key: '_handleWheel',
		value: function _handleWheel(e) {
			var gestureDetails = this._getGestureDetails(e);
			gestureDetails.gesture.scrollDelta = e.deltaY;
			this._emitEvent('onScroll', gestureDetails);
			if (this.pseudoState.wheelTimer) {
				clearTimeout(this.pseudoState.wheelTimer);
			}
			this.pseudoState.wheelTimer = setTimeout(this._handleScrollEnd.bind(this, gestureDetails), this.props.scrollEndTimeout);
		}
	}, {
		key: '_handleScrollEnd',
		value: function _handleScrollEnd(e) {
			this._emitEvent('onScrollEnd', e);
			clearTimeout(this.pseudoState.wheelTimer);
		}
	}, {
		key: 'render',
		value: function render() {
			var children = this.props.children;
			var element = React.Children.only(children);

			return React.cloneElement(element, {
				onTouchStart: this._handleTouchStart,
				onTouchCancel: this._handleTouchCancel,
				onMouseDown: this._handleMouseDown
			});
		}
	}]);

	return ReactGesture;
}(React.Component), (_applyDecoratedDescriptor(_class.prototype, '_handleTouchStart', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleTouchStart'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleTouchMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleTouchMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleTouchCancel', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleTouchCancel'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleTouchEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleTouchEnd'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleMouseDown'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleMouseUp'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleWheel', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleWheel'), _class.prototype)), _class);


ReactGesture.propTypes = {
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
	children: React.PropTypes.element
};

ReactGesture.defaultProps = {
	flickThreshold: 0.6,
	swipeThreshold: 10,
	holdTime: 400,
	scrollEndTimeout: 200
};