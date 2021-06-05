const path = require('path')
const copy = require('rollup-plugin-copy')

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/main.ts'),
      name: 'caracal_sirius'
    }
  },
  plugins: [
    copy({
      targets: [
        { src: 'dist/**/*', dest: 'docs/lib' }
      ],
      hook: 'writeBundle'
    })
  ]
}