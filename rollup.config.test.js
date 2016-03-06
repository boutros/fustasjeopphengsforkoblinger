import babel from 'rollup-plugin-babel'
import multiEntry from 'rollup-plugin-multi-entry'

export default {
  entry: 'test/**/*_test.js',
  plugins: [
	  babel({
	    babelrc: false,
	    presets: ['es2015-rollup'],
	    exclude: 'node_modules/**'
	  }),
	  multiEntry()
	  ],
  format: 'cjs',
  intro: 'require("source-map-support").install()',
  dest: 'test/test-bundle.js',
  sourceMap: true
}
