# react-gesture

[![npm package](https://badge.fury.io/js/react-gesture.svg)](https://www.npmjs.org/package/react-gesture)
[![Dependency Status](https://david-dm.org/opensource-cards/react-gesture.svg)](https://david-dm.org/opensource-cards/react-gesture)
[![devDependency Status](https://david-dm.org/opensource-cards/react-gesture/dev-status.svg)](https://david-dm.org/opensource-cards/react-gesture#info=devDependencies)
[![peerDependency Status](https://david-dm.org/opensource-cards/react-gesture/peer-status.svg)](https://david-dm.org/opensource-cards/react-gesture#info=peerDependencies)

A gesture recognizer for web and mobile devices for React.

![](https://github.com/opensource-cards/react-gesture/blob/master/demo.gif)

### Installation

Using [npm](https://www.npmjs.com/):

```
npm install react-gesture --save
```

### API

prop               | type                  | default value
-------------------|-----------------------|--------------
`onSwipeUp`        | `func`                |
`onSwipeDown`      | `func`                |
`onSwipeLeft`      | `func`                |
`onSwipeRight`     | `func`                |
`onTap`            | `func`                |
`onClick`          | `func`                |
`onHold`           | `func`                |
`onPinchToZoom`    | `func`                |
`onTouchStart`     | `func`                |
`onTouchMove`      | `func`                |
`onTouchCancel`    | `func`                |
`onTouchEnd`       | `func`                |
`onMouseDown`      | `func`                |
`onMouseMove`      | `func`                |
`onMouseUp`        | `func`                |
`onScroll`         | `func`                |
`onScrollEnd`      | `func`                |
`disableClick`     | `bool | func`         |
`children`         | `element`             |
`flickThreshold`   | `number`              | 0.6
`holdTime`         | `number`              | 400
`scrollEndTimeout` | `number`              | 200
`swipeThreshold`   | `number`              | 10

### Examples

* Main ([source](https://github.com/opensource-cards/react-gesture/tree/master/examples/main))

### License

MIT
