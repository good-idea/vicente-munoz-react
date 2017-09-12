

module.exports.shuffleArray = (arr) => {
	const array = [...arr]
	let currentIndex = array.length
	// let temporaryValue
	// let randomIndex

	// While there remain elements to shuffle...
	while (currentIndex !== 0) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex -= 1

		// And swap it with the current element.
		const temporaryValue = array[currentIndex]
		array[currentIndex] = array[randomIndex]
		array[randomIndex] = temporaryValue
	}

	return array
}

/**
 * Cheap shallow equalitly checker
 */

module.exports.isEqual = (obj1, obj2) => {
	// return (JSON.stringify(obj1) === JSON.stringify(obj2));
	const obj1keys = Object.keys(obj1);

	for (const key of obj1keys) {
		if (!obj2.hasOwnProperty(key)) return false
		if (obj1[key] != obj2[key]) {
			return false
		}
	}
	return true;
}

module.exports.formatDate = (input) => {
	const dateObj = (input.constructor === Date) ? input : new Date(input);
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
	return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
};

/*
 TODO:
  - Validate destination as int or dom element
 */

module.exports.scrollToElement = (destination, overrides) => {
	const defaults = {
		container: window,
		duration: 600,
		easing: 'easeOutQuad',
	};
	const config = { ...defaults, ...overrides };
	if (typeof tweenFunctions[config.easing] !== 'function') {
		console.warn(`${config.easing} is not a valid easing function.`);
		config.easing = defaults.easing;
	}

	const startY = config.container.scrollTop;
	const destY = destination.offsetTop;
	const startTime = Date.now();

	if (config.duration === 0) {
		config.container.scrollTop = destY;
		if (config.callback) config.callback();
		return;
	}

	if (startY === destY) {
		if (config.callback) config.callback();
		return;
	}

	function tween() {
		const elapsed = Math.min(Date.now() - startTime, config.duration);
		const newTop = tweenFunctions[config.easing](elapsed, startY, destY, config.duration);
		config.container.scrollTop = newTop;


		if (elapsed < config.duration) {
			requestAnimationFrame(tween);
		} else if (config.callback) {
			config.callback();
		}
	}

	requestAnimationFrame(tween);
};


/**
 * Combines any number of array or string arguments into a single, space-separated className string
 * @param  {string|array} input		'class1', ['class2', 'class1--modifier'], 'class3'
 * @return {string}       				'class1 class2 class1--modifier class3'
 */
module.exports.cn = (...input) => {
	const allNames = [];
	for (const piece of input) {
		if (piece) {
			if (typeof piece === 'string') {
				allNames.push(...piece.split(' '));
			} else if (piece.constructor === Array) {
				allNames.push(...piece);
			} else {
				console.warn(`Input must be string or array, ${typeof piece} given.`);
			}
		}
	}
	return allNames.join(' ');
};

module.exports.findOne = (haystack, needles) => needles.some(needle => haystack.indexOf(needle) >= 0);

module.exports.slugify = text => text.toString().toLowerCase().replace(/\s+/g, '-');
