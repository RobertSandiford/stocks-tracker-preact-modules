import { load } from '../lib'

//export default load(__dirname)


import ExchangeRate from './ExchangeRate/ExchangeRate'
import Holding from './Holding/Holding'
import HoldingOpen from './HoldingOpen/HoldingOpen'
import HoldingClose from './HoldingClose/HoldingClose'

export default {
    ...ExchangeRate,
    ...Holding,
    ...HoldingOpen,
    ...HoldingClose,
}

/*
const fs = require("fs")

let entities = {}

const files = fs.readdirSync(__dirname)
for ( const file of files ) {
    if (file !== "index.js") {
        entities = { ...entities, ...require("./" + file) }
    }
}

module.exports = entities
*/