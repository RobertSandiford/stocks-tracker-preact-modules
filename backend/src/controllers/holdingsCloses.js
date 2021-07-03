

const respond = require('./respond')

module.exports.update = (req, res) => {

    let holding = req.body

    console.log("saving holding close", holding, holding.close)

    Holding.updateOne(
        { _id : holding._id },
        { "$push" : { closes : holding.close } },
        (err) => {

            if (err) {
                console.error(err);

                let response = {
                    status : "ERROR",
                    reason : "Could not save close info"
                }
                respond(res, response)

                return 
            }

            console.log("Holding updated", holding);
            
            //respond
            let response = {
                status : "OK",
                holding : holding
            }
            respond(res, response)

        }
    )

}

module.exports.remove = (req, res) => {

    console.log("removing close", req.body)

    let data = req.body
    


    // save model to database
    Holding.updateOne(
        { _id : data.holding_id },
        { '$pull': {
            closes : { _id : data.close_id }
        } },
        (err) => {
            if (err) {
                console.error(err);

                let response = {
                    status : "ERROR",
                    reason : "Could not delete close record"
                }
                respond(res, response)

                return
            }

            console.log("Close record deleted Holding: " + data.holding_id + " Close: " + data.close_id);

            let response = {
                status : "OK",
                holding_id : data.holding_id,
                close_id : data.close_id,
            }
            respond(res, response)

        }
    );

}
