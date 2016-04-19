import { Right, Down, Left, Up } from '../constants/direction-types';

function getXY(touch) {
	return {
		x: touch.clientX,
		y: touch.clientY,
	};
}

export function touchListMap(list) {
	const result = [];
	const listLength = list.length;
	for (let i = 0; i < listLength; ++i) {
		result.push(getXY(list[i]));
	}
	return result;
}

export function distance(points, x = 'x', y = 'y') {
	const firstPoint = points[1];
	const zeroPoint = points[0];
	const dX = firstPoint[x] - zeroPoint[x];
	const dY = firstPoint[y] - zeroPoint[y];
	return Math.sqrt(dX * dX + dY * dY);
}

function getDirectionX(deltaX) {
	return deltaX < 0 ? Right : Left;
}

function getDirectionY(deltaY) {
	return deltaY < 0 ? Down : Up;
}

export function getDirection(deltaX, absX, deltaY, absY) {
	return (absX > absY) ? getDirectionX(deltaX) : getDirectionY(deltaY);
}
