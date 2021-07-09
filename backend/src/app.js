
///////////////////////////
// Deps
///////////////////////////

import dotenv from 'dotenv'
import 'colors'
import './globals'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import * as models from './models'
import { typeDefs, resolvers } from './graph'
import routes from './routes'


const createApp = async () => {

    dotenv.config()

    ///////////////////////////
    // Vars/Defines
    ///////////////////////////
    //const enviro = process.env.enviro
    const defaultPort = process.env.port || 4000

    ///////////////////////////
    // Set up
    ///////////////////////////

    const app = express()
    app.use( cors() )
    app.use(express.json()) // parse JSON input



    ///////////////////////////
    // DB
    ///////////////////////////

    const mongoUrl = 'mongodb://<user>:<pass>@<host>:<port>/<db>?retryWrites=true&w=majority'
        .replace("<host>", process.env.mongo_host)
        .replace("<port>", process.env.mongo_port)
        .replace("<user>", process.env.mongo_user)
        .replace("<pass>", process.env.mongo_pass)
        .replace("<db>", process.env.mongo_db)

    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify : false
        })
        console.log("Connected to Mongo DB")
    } catch(e) {
        console.log("Mongoose connection error? ", e)
    }

    app.dbDisconnect = async () => {
        await mongoose.connection.close()
    }
    


    ///////////////////////////
    // Models
    ///////////////////////////

    // Load all models

    for (const model in models) {
        eval(`var ${model} = models[model]`)
    }



    ///////////////////////////
    // Setup graph server
    ///////////////////////////
    
    //console.log(typeDefs.blue)
    //return
    
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    })
    apolloServer.applyMiddleware({app})

    //console.log("graphql path: " + apolloServer.graphqlPath)



    ///////////////////////////
    // Static Routes
    ///////////////////////////

    app.use('/', express.static('frontend/build'))



    ///////////////////////////
    // Routes
    ///////////////////////////


    routes(app)



    ///////////////////////////
    // Control Methods
    ///////////////////////////

    let server

    app.start = (port = defaultPort) => {
        return new Promise( (resolve, reject) => {
            console.log("Starting server on port " + port)
            server = app.listen(port, () => {
                const listeningPort = server.address().port
                console.log("Listening on port " + listeningPort)
                resolve(listeningPort)
            })
        })
    }
    
    app.stop = () => {
        server.close()
        app.dbDisconnect()
    }
    
    app.destroy = () => {
        app.dbDisconnect()
    }


    // Return the ready app
    return app
}

export { createApp }