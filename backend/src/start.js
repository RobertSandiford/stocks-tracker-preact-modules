
require('dotenv').config()

const { createApp } = require('./app')

createApp().then( app => {
    // Start the Server!
    app.start()
})

