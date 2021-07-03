
const main = require('../controllers/main')
const holdings = require('../controllers/holdings')
const holdingsOpens = require('../controllers/holdingsOpens')
const holdingsCloses = require('../controllers/holdingsCloses')
const rates = require('../controllers/rates')

///////////////////////////
// Routes
///////////////////////////

module.exports = (app) => {

    app.get('/', main.index)

    
    app.get('/holdings/list', holdings.list)
    
    /*
    app.post('/holdings/add', holdings.add)
    
    app.post('/holdings/update', holdings.update)

    app.post('/holdings/remove', holdings.remove)
    */


    app.post('/holdings/open/remove', holdingsOpens.remove)
    
    app.post('/holdings/close/save', holdingsCloses.update)

    app.post('/holdings/close/remove', holdingsCloses.remove)



    app.get('/rate/gbp', rates.rateGbp)

    app.get('/rate', rates.rate)
    

}