import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactGesture from 'react-gesture';

// only for test
var zoom = {
	scale: 1.0,
	origin: {
		x: window.innerWidth/2,
		y: window.innerHeight/2
	},
	apply: (pinch) => {
		var oldScale = zoom.scale;
		var newScale = oldScale * pinch.scale;
		var calculateOrigin = (z: number, p: number) => (
			(p * (newScale - oldScale) + z * newScale * (oldScale - 1)) /
			((newScale - 1) * oldScale));
		var newOrigin = {
			x: calculateOrigin(zoom.origin.x, pinch.origin.x),
			y: calculateOrigin(zoom.origin.y, pinch.origin.y)
		};
		zoom.origin = newOrigin;
		zoom.scale = newScale;
		document.body.style.transformOrigin = zoom.origin.x + 'px ' + zoom.origin.y + 'px';
		document.body.style.transform = 'scale(' + zoom.scale + ')';
	}
};
ReactDOM.render(
	<ReactGesture
		onSwipeUp={function() {
					console.log('onSwipeUp 1');
				}}
		onSwipeDown={function() {
					console.log('onSwipeDown 1');
				}}
		onSwipeLeft={function() {
					console.log('onSwipeLeft 1');
				}}
		onSwipeRight={function() {
					console.log('onSwipeRight 1');
				}}
		onTap={function() {
					console.log('onTap 1');
				}}
		onTouchStart={function() {
					//console.log('onTouchStart 1');
				}}
		onTouchMove={function() {
					//console.log('onTouchMove 1');
				}}
		onTouchCancel={function() {
					console.log('onTouchCancel 1');
				}}
		onTouchEnd={function() {
					//console.log('onTouchEnd 1');
				}}
		onMouseDown={function() {
					//console.log('onMouseDown 1');
				}}
		onMouseMove={function() {
					//console.log('onMouseMove 1');
				}}
		onMouseUp={function() {
					//console.log('onMouseUp 1');
				}}
		onClick={function() {
					console.log('onClick 1');
				}}
		onHold={function() {
					console.log('onHold 1');
				}}
		onPinchToZoom={function(e:any) {
					console.log('onPinchToZoom 1');
					zoom.apply(e.pinch);
				}}
		>
		<div>
			<div style={ { height: '100px' } }>Block 1</div>
			<div style={ { height: '100px' } }>Block 2</div>
			<div style={ { height: '100px' } }>
				<ReactGesture
					onSwipeUp={function() {
					console.log('onSwipeUp 2');
				}}
					onSwipeDown={function() {
					console.log('onSwipeDown 2');
				}}
					onSwipeLeft={function() {
					console.log('onSwipeLeft 2');
				}}
					onSwipeRight={function() {
					console.log('onSwipeRight 2');
				}}
					onTap={function() {
					console.log('onTap 2');
				}}
					onTouchStart={function() {
					//console.log('onTouchStart 2');
				}}
					onTouchMove={function() {
					//console.log('onTouchMove 2');
				}}
					onTouchCancel={function() {
					console.log('onTouchCancel 2');
				}}
					onTouchEnd={function() {
					//console.log('onTouchEnd 2');
				}}
					onMouseDown={function() {
					//console.log('onMouseDown 2');
				}}
					onMouseMove={function() {
					//console.log('onMouseMove 2');
				}}
					onMouseUp={function() {
					//console.log('onMouseUp 2');
				}}
					onClick={function() {
					console.log('onClick 2');
				}}
					onHold={function() {
					console.log('onHold 2');
				}}
					onPinchToZoom={function(e:any) {
					console.log('onPinchToZoom 2');
					zoom.apply(e.pinch);
				}}
				>
					<div>
						<div style={ { height: '100px' } } 
							onClick={() => console.log('dom click event')}>
							Block A
						</div>
						<div style={ { height: '100px' } }>Block B</div>
						<input type="text" defaultValue="Some text to test selection" />
						<div style={ { height: '100px' } }>Block C</div>
					</div>
				</ReactGesture>
			</div>
		</div>
	</ReactGesture>,
	document.getElementById('StackBlocks')
);
