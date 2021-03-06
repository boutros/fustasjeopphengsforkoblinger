import riot        from 'rollup-plugin-riot'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs'
import babel       from 'rollup-plugin-babel'

export default {
  entry: 'src/main.js',
  dest: 'public/bundle.js',
  plugins: [
    riot({
      ext: 'html'
    }),
    nodeResolve({
      jsnext:  true, // if provided in ES6
      main:    true, // if provided in CommonJS
      browser: true  // if provided for browsers
    }),
    commonjs(),
    babel({
      plugins: ['transform-runtime'], // TODO figure out how to use this properly (check rollup warnings)
      runtimeHelpers: true,
      babelrc: false,
      presets: ['es2015-rollup'],
      exclude: 'node_modules/**'
    })
  ]
}
