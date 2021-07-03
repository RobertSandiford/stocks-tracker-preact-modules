
require('dotenv').config();

const port = process.env.port || 4000
const enviro = process.env.enviro

const { createApp } = require('./app')

createApp().then( app => {
    // Start the Server!
    app.start()
})

