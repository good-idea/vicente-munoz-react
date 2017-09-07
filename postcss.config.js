// const path = require('path');

module.exports = (ctx) => {
	return ({
		map: { inline: false },
		parser: ctx.options.parser,
		plugins: {
			'postcss-import': {},
			'postcss-advanced-variables': {},
			'postcss-math': {},
			'postcss-mixins': {},
			'postcss-extend': {},
			'postcss-nested': {},
			'postcss-cssnext': {},
			cssnano: {},
		},
	});
};
