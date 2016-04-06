'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.touchListMap = touchListMap;
exports.distance = distance;
exports.getDirection = getDirection;
exports.getXY = getXY;
function touchListMap(list, callback) {
	// TouchList.map is not defined
	// return list.map(listItem => callback(listItem));
	var result = [];

	for (var i = 0, listLength = list.length; i < listLength; ++i) {
		result.push(callback(list[i]));
	}

	return result;
}

function distance(points) {
	var x = arguments.length <= 1 || arguments[1] === undefined ? 'x' : arguments[1];
	var y = arguments.length <= 2 || arguments[2] === undefined ? 'y' : arguments[2];

	var dX = points[1][x] - points[0][x];
	var dY = points[1][y] - points[0][y];

	return Math.sqrt(dX * dX + dY * dY);
}

function getDirectionX(deltaX) {
	return deltaX < 0 ? 'Right' : 'Left';
}

function getDirectionY(deltaY) {
	return deltaY < 0 ? 'Down' : 'Up';
}

function getDirection(deltaX, absX, deltaY, absY) {
	return absX > absY ? getDirectionX(deltaX) : getDirectionY(deltaY);
}

function getXY(touch) {
	return {
		x: touch.clientX,
		y: touch.clientY
	};
}