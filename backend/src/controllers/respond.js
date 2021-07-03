
module.exports = function respond(res, response) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(response))
}