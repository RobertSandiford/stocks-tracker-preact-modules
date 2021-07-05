
const main = require('../controllers/main')
const holdings = require('../controllers/holdings')
const rates = require('../controllers/rates')

///////////////////////////
// Routes
///////////////////////////

module.exports = (app) => {

    app.get('/', main.index)

    app.get('/holdings/list', holdings.list)
    
    app.get('/rate/gbp', rates.rateGbp)

    app.get('/rate', rates.rate)

}