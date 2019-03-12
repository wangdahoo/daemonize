import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const pgkName = pkg.name.split('-').map(w => `${w[0].toUpperCase()}${w.slice(1)}`).join('')
const MODULE_NAME = '$MODULE_NAME'
const input = 'src/index.js'

export default [
    // browser-friendly UMD build
    {
        input,
        output: {
            name: pgkName,
            file: pkg.browser.replace(MODULE_NAME, pkg.name),
            format: 'umd'
        },
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**' // only transpile our source code
            }),
            commonjs() // so Rollup can convert our module to an ES module
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input,
		output: [
			{ file: pkg.main.replace(MODULE_NAME, pkg.name), format: 'cjs' },
			{ file: pkg.module.replace(MODULE_NAME, pkg.name), format: 'es' }
		]
	}
];
