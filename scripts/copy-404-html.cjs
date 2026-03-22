const fs = require('node:fs')
const path = require('node:path')

const dist = path.join(__dirname, '..', 'dist')
const index = path.join(dist, 'index.html')
const notFound = path.join(dist, '404.html')

if (fs.existsSync(index)) {
  fs.copyFileSync(index, notFound)
}
