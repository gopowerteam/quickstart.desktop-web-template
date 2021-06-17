import { resolve, join } from 'path'
import fs from 'fs'
import R from 'ramda'

const ROOT = resolve('./node_modules/@ant-design/icons-vue')

const exportsPatch = {
    ".": {
        "import": "./es/index.js",
        "require": "./lib/index.js"
    },
    "./*": {
        "import": "./es/icons/*.js",
        "require": "./lib/icons/*.js"
    }
}

const patch = async (path) => {
    const loadPkg = packagePath => import(packagePath)
    const updatePkg = pkg => JSON.stringify(R.set(R.lensProp('exports'), exportsPatch, pkg))
    const writePkg = R.curry(fs.writeFileSync)(path, R.__, { encoding: 'utf-8', flag: 'w' })

    R.pipe(
        pkg => pkg.default,
        updatePkg,
        writePkg,
    )(await loadPkg(path))
}

export default () => patch(join(ROOT, 'package.json'))