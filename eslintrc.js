module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/strongly-recommended', 'eslint:recommended'],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-mixed-spaces-and-tabs': 'off',
		'vue/no-unused-vars': 'off',
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
};
