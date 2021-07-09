
import * as main from '../controllers/main'
//import * as holdings from '../controllers/holdings'
//import * as rates from '../controllers/rates'

///////////////////////////
// Routes
///////////////////////////

export default (app) => {

    app.get('/', main.index)

    //app.get('/holdings/list', holdings.list)
    
    //app.get('/rate/gbp', rates.rateGbp)

    //app.get('/rate', rates.rate)

}