import * as React from 'react';
import autobind from 'autobind-decorator';
import { touchListMap, distance, getDirection, getXY } from '../utils/geture-calculations';

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

const LINE_HEIGHT = 20;

export class ReactGesture extends React.Component {

	constructor(props) {
		super(props);

		this.pseudoState = {
			x: null,
			y: null,
			swiping: false,
			pinch: false,
			start: 0,
			holdTimer: null,
			wheelTimer: null,
			fingers: [],
		};

		window.addEventListener('mousemove', this._handleMouseMove);
		window.addEventListener('mouseup', this._handleMouseUp);
		window.addEventListener('touchmove', this._handleTouchMove);
		window.addEventListener('touchend', this._handleTouchEnd);
		window.addEventListener('wheel', this._handleWheel);
	}

	_resetState() {
		clearTimeout(this.pseudoState.holdTimer);
		this.pseudoState = {
			x: null,
			y: null,
			swiping: false,
			pinch: false,
			start: Number.POSITIVE_INFINITY,
			holdTimer: null,
			wheelTimer: null,
			fingers: [],
		};
	}

	_emitEvent(name, e) {
		if (this.props[name]) {
			this.props[name](e);
		}
	}

	_getGestureDetails(e) {
		const { clientX, clientY } = e.changedTouches ? e.changedTouches[0] : e;
		const deltaX = this.pseudoState.x - clientX;
		const deltaY = this.pseudoState.y - clientY;
		const absX = Math.abs(deltaX);
		const absY = Math.abs(deltaY);
		const duration = Date.now() - this.pseudoState.start;
		const velocity = Math.sqrt(absX * absX + absY * absY) / duration;
		const velocityX = absX / duration;
		const velocityY = absY / duration;
		const done = e.type === 'touchend';

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

		return e;
	}

	@autobind
	_handleTouchStart(e) {
		this._emitEvent('onTouchStart', e);

		let holdTimer = this.pseudoState.holdTimer;
		if (holdTimer === null) {
			holdTimer = setTimeout(this._handleHoldGesture, this.props.holdTime, e);
		}

		this.pseudoState = {
			start: Date.now(),
			x: e.touches[0].clientX,
			y: e.touches[0].clientY,
			swiping: false,
			pinch: false,
			holdTimer,
			fingers: touchListMap(e.touches, getXY),
		};

		e.preventDefault();
	}

	@autobind
	_handleTouchMove(e) {
		e.preventDefault();
		const gestureDetails = this._getGestureDetails(e);

		this._emitEvent('onTouchMove', gestureDetails);

		if (this.pseudoState.x !== null) {
			if (e.touches.length === 2) {
				if (this.pseudoState.fingers.length === 2) {
					this._handlePinch(e);
				}

				this.pseudoState.fingers = touchListMap(e.touches, getXY);

				return;
			}

			const gestureDetailsGesture = gestureDetails.gesture;
			const swipeThreshold = this.props.swipeThreshold;
			if (this.pseudoState.swiping
				|| gestureDetailsGesture.absX > swipeThreshold
				|| gestureDetailsGesture.absY > swipeThreshold
			) {
				this._handleSwipeGesture(gestureDetails);
				return;
			}
		}
	}

	_handlePinch(e) {
		this.pseudoState.pinch = true;
		const fingers = this.pseudoState.fingers;
		const prevDist = distance(fingers);
		const currDist = distance(e.touches, 'clientX', 'clientY');
		const scale = currDist / prevDist;
		const origin = {
			x: (fingers[0].x + fingers[1].x) / 2,
			y: (fingers[0].y + fingers[1].y) / 2,
		};

		e.pinch = {
			scale,
			origin,
		};

		this._emitEvent('onPinchToZoom', e);
	}

	@autobind
	_handleTouchCancel(e) {
		this._emitEvent('onTouchCancel', e);
		this._resetState();
	}

	@autobind
	_handleTouchEnd (e) {
		const ge = this._getGestureDetails(e);

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

	_handleTapGesture(ge) {
		ge.gesture.type = 'tap';
		// no more fingers on the screen => no position
		ge.clientX = this.pseudoState.x;
		ge.clientY = this.pseudoState.y;
		this._emitEvent('onTap', ge);
	}

	@autobind
	_handleMouseDown(e) {
		this._emitEvent('onMouseDown', e);

		const holdTimer = setTimeout(this._handleHoldGesture, this.props.holdTime, e);

		this.pseudoState = {
			start: Date.now(),
			x: e.clientX,
			y: e.clientY,
			swiping: false,
			pinch: false,
			holdTimer,
		};
	}

	@autobind
	_handleMouseMove(e) {
		const gestureDetails = this._getGestureDetails(e);

		this._emitEvent('onMouseMove', gestureDetails);

		if (this.pseudoState.x !== null && this.pseudoState.y !== null && (this.pseudoState.swiping
			|| gestureDetails.gesture.absX > this.props.swipeThreshold
			|| gestureDetails.gesture.absY > this.props.swipeThreshold)
		) {
			this._handleSwipeGesture(gestureDetails);
			return;
		}
	}

	@autobind
	_handleMouseUp(e) {
		const gestureDetails = this._getGestureDetails(e);

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

	_handleClickGesture(gestureDetails) {
		gestureDetails.gesture.type = 'click';
		this._emitEvent('onClick', gestureDetails);
	}

	_handleSwipeGesture(gestureDetails) {
		const { deltaX, absX, deltaY, absY } = gestureDetails.gesture;
		const direction = getDirection(deltaX, absX, deltaY, absY);

		if (!this.pseudoState.swiping) {
			this.pseudoState.swiping = true;
			this.pseudoState.swipingDirection = (absX > absY) ? 'x' : 'y';
		}

		if ((this.pseudoState.swipingDirection === 'x' && absX > absY) ||
			(this.pseudoState.swipingDirection === 'y' && absY > absX)) {
			gestureDetails.gesture.isFlick = gestureDetails.gesture.velocity > this.props.flickThreshold;
			gestureDetails.gesture.type = `swipe${direction.toLowerCase()}`;
			this._emitEvent(`onSwipe${direction}`, gestureDetails);
			gestureDetails.preventDefault();
		}
	}

	@autobind
	_handleHoldGesture(e) {
		const fingers = this.pseudoState.fingers;
		if (!this.pseudoState.swiping && (!fingers || fingers.length === 1)) {
			this._emitEvent('onHold', e);
		}
	}

	@autobind
	_handleWheel(e) {
		const gestureDetails = this._getGestureDetails(e);
		gestureDetails.gesture.scrollDelta = e.deltaY * (e.deltaMode ? LINE_HEIGHT : 1);
		this._emitEvent('onScroll', gestureDetails);
		if (this.pseudoState.wheelTimer) {
			clearTimeout(this.pseudoState.wheelTimer);
		}
		this.pseudoState.wheelTimer = setTimeout(this._handleScrollEnd, this.props.scrollEndTimeout);
	}

	@autobind
	_handleScrollEnd(e) {
		this._emitEvent('onScrollEnd', e);
		clearTimeout(this.pseudoState.wheelTimer);
	}

	render() {
		const children = this.props.children;
		const element = React.Children.only(children);
		return React.cloneElement(element, {
			onTouchStart: this._handleTouchStart,
			onTouchCancel: this._handleTouchCancel,
			onMouseDown: this._handleMouseDown,
		});
	}
}

ReactGesture.propTypes = propTypes;
ReactGesture.defaultProps = defaultProps;
