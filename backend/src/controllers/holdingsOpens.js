module.exports.remove = (req, res) => {

    console.log("removing open", req.body)
    let data = req.body
    
    // save model to database
    Holding.findOneAndUpdate(
        { _id : data.holding_id },
        { '$pull': {
            opens : { _id : data.open_id }
        } },
        { new : true },
        (err, holding) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status : "ERROR",
                    reason : "Could not delete open record"
                }));
                return console.error(err);
            }
            console.log("Open record deleted Holding: " + data.holding_id + " Open: " + data.open_id);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status : "OK",
                holding_id : data.holding_id,
                open_id : data.open_id,
                holding : holding
            }));
        }
    );

}