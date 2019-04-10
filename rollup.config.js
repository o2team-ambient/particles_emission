import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import scss from 'rollup-plugin-sass'
import json from 'rollup-plugin-json'
import style from 'rollup-plugin-style'

const name = 'ATAmbient'

export default [{
  input: 'src/rollup_index.js',
  output: {
    file: 'dist/index.dev.js',
    format: 'umd',
    name
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      comments: true,
      exclude: ['node_modules/**', 'src/js/utils/bodymovin.js']
    }),
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      // include: 'node_modules/**',
      exclude: 'node_modules/**',
 
      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false
 
      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: '  ',
 
      // ignores indent and generates the smallest code
      compact: true, // Default: false
 
      // generate a named export for every property of the JSON object
      namedExports: true // Default: true
    }),
    scss(),
    style()
  ]
}, {
  input: 'src/rollup_index.js',
  output: {
    file: 'dist/index.min.js',
    sourcemap: true,
    format: 'umd',
    name
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      presets: [["@babel/preset-env"]],
      exclude: ['node_modules/**', 'src/js/utils/bodymovin.js']
    }),
    scss(),
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      // include: 'node_modules/**',
      exclude: 'node_modules/**',
 
      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: false, // Default: false
 
      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: '  ',
 
      // ignores indent and generates the smallest code
      compact: true, // Default: false
 
      // generate a named export for every property of the JSON object
      namedExports: true // Default: true
    }),
    scss(),
    style(),
    uglify()
  ]
}]
