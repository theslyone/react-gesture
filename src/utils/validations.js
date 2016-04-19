
export function isCorrectSwipe(swipingDirection, absX, absY) {
	return (swipingDirection === 'x' && absX > absY) || (swipingDirection === 'y' && absY > absX);
}
