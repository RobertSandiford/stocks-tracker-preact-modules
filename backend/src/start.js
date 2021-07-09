
import dotenv from 'dotenv'
dotenv.config()

import { createApp } from './app'

createApp().then( app => {
    // Start the Server!
    app.start()
})

