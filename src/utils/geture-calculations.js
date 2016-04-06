export function touchListMap(list, callback) {
	// TouchList.map is not defined
	// return list.map(listItem => callback(listItem));
	const result = [];

	for (let i = 0, listLength = list.length; i < listLength; ++i) {
		result.push(callback(list[i]));
	}

	return result;
}

export function distance(points, x = 'x', y = 'y') {
	const dX = points[1][x] - points[0][x];
	const dY = points[1][y] - points[0][y];

	return Math.sqrt(dX * dX + dY * dY);
}

function getDirectionX(deltaX) {
	return deltaX < 0 ? 'Right' : 'Left';
}

function getDirectionY(deltaY) {
	return deltaY < 0 ? 'Down' : 'Up';
}

export function getDirection(deltaX, absX, deltaY, absY) {
	return (absX > absY) ? getDirectionX(deltaX) : getDirectionY(deltaY);
}

export function getXY(touch) {
	return {
		x: touch.clientX,
		y: touch.clientY,
	};
}
