const path = require('path')

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/main.ts'),
      name: 'caracal_sirius'
    }
  }
}