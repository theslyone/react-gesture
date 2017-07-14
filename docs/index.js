/* global document, window */
import {
  BINARY_COLOR_SAND_80,
  BINARY_COLOR_SLATE_80,
  BINARY_COLOR_YELLOW_80,
  BINARY_COLOR_RED_80,
  BINARY_COLOR_BLUE_80,
  BINARY_COLOR_GREEN_80,
} from 'binary-ui-styles';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGesture from 'react-gesture';

// only for test
const zoom = {
  scale: 1.0,
  origin: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  },
  apply: (pinch) => {
    var oldScale = zoom.scale;
    var newScale = oldScale * pinch.scale;
    var calculateOrigin = (z, p) => (
      (p * (newScale - oldScale) + z * newScale * (oldScale - 1)) /
      ((newScale - 1) * oldScale));
    var newOrigin = {
      x: calculateOrigin(zoom.origin.x, pinch.origin.x),
      y: calculateOrigin(zoom.origin.y, pinch.origin.y),
    };
    zoom.origin = newOrigin;
    zoom.scale = newScale;
    document.body.style.transformOrigin = zoom.origin.x + 'px ' + zoom.origin.y + 'px';
    document.body.style.transform = 'scale(' + zoom.scale + ')';
  },
};
ReactDOM.render(
  <ReactGesture
    onSwipeUp={() => {
      //console.log('onSwipeUp 1');
    }}
    onSwipeDown={() => {
      //console.log('onSwipeDown 1');
    }}
    onSwipeLeft={() => {
      //console.log('onSwipeLeft 1');
    }}
    onSwipeRight={() => {
      //console.log('onSwipeRight 1');
    }}
    onTap={() => {
      //console.log('onTap 1');
    }}
    onTouchStart={() => {
      // //console.log('onTouchStart 1');
    }}
    onTouchMove={() => {
      // //console.log('onTouchMove 1');
    }}
    onTouchCancel={() => {
      //console.log('onTouchCancel 1');
    }}
    onTouchEnd={() => {
      // //console.log('onTouchEnd 1');
    }}
    onMouseEnter={() => {
      console.log('onMouseEnter 1');
    }}
    onMouseLeave={() => {
      console.log('onMouseLeave 1');
    }}
    onMouseDown={() => {
      // //console.log('onMouseDown 1');
    }}
    onMouseMove={() => {
      // //console.log('onMouseMove 1');
    }}
    onMouseUp={() => {
      // //console.log('onMouseUp 1');
    }}
    onClick={() => {
      //console.log('onClick 1');
    }}
    onHold={() => {
      //console.log('onHold 1');
    }}
    onPinchToZoom={(e) => {
      //console.log('onPinchToZoom 1');
      zoom.apply(e.pinch);
    }}
  >
    <div>
      <div style={{ height: '100px', backgroundColor: BINARY_COLOR_YELLOW_80 }} />
      <div style={{ height: '100px', backgroundColor: BINARY_COLOR_SAND_80 }} />
      <div style={{ height: '100px', backgroundColor: BINARY_COLOR_SLATE_80 }} >
        <ReactGesture
          onSwipeUp={() => {
            //console.log('onSwipeUp 2');
          }}
          onSwipeDown={() => {
            //console.log('onSwipeDown 2');
          }}
          onSwipeLeft={() => {
            //console.log('onSwipeLeft 2');
          }}
          onSwipeRight={() => {
            //console.log('onSwipeRight 2');
          }}
          onTap={() => {
            //console.log('onTap 2');
          }}
          onTouchStart={() => {
            // //console.log('onTouchStart 2');
          }}
          onTouchMove={() => {
            // //console.log('onTouchMove 2');
          }}
          onTouchCancel={() => {
            //console.log('onTouchCancel 2');
          }}
          onTouchEnd={() => {
            // //console.log('onTouchEnd 2');
          }}
          onMouseEnter={() => {
            console.log('onMouseEnter 2');
          }}
          onMouseLeave={() => {
            console.log('onMouseLeave 2');
          }}
          onMouseDown={() => {
            console.log('onMouseDown 2');
          }}
          onMouseMove={() => {
            // //console.log('onMouseMove 2');
          }}
          onMouseUp={() => {
            // //console.log('onMouseUp 2');
          }}
          onClick={() => {
            //console.log('onClick 2');
          }}
          onHold={() => {
            //console.log('onHold 2');
          }}
          onPinchToZoom={(e) => {
            //console.log('onPinchToZoom 2');
            zoom.apply(e.pinch);
          }}
        >
          <div>
            <div
              style={{ height: '100px', backgroundColor: BINARY_COLOR_RED_80 }}
              onClick={() => console.log('dom click event')}
            />
            <div
              style={{ height: '100px', backgroundColor: BINARY_COLOR_BLUE_80 }}
            />
            <input defaultValue="Some text to test selection" style={{ width: '100%' }} type="text" />
            <div
              style={{ height: '100px', backgroundColor: BINARY_COLOR_GREEN_80 }}
            />
          </div>
        </ReactGesture>
      </div>
    </div>
  </ReactGesture>,
  document.getElementById('StackBlocks')
);
