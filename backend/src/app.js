
///////////////////////////
// Deps
///////////////////////////

dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')
const { typeDefs, resolvers } = require('./graph')
const { DateTime : Luxon , Settings : LuxonSettings } = require('luxon')

const routes = require('./routes')


const createApp = async () => {

    dotenv.config()

    ///////////////////////////
    // Vars/Defines
    ///////////////////////////
    const port = process.env.port || 4000
    const enviro = process.env.enviro


    ///////////////////////////
    // Set up
    ///////////////////////////

    const app = express()
    app.use( cors() )
    app.use(express.json()); // parse JSON input

    const apolloServer = new ApolloServer({
        typeDefs : typeDefs,
        resolvers : resolvers
    })
    apolloServer.applyMiddleware({app})

    console.log("graphql path: " + apolloServer.graphqlPath)


    // Luxon DateTimes
    LuxonSettings.defaultLocale = "en-GB"
    let stDateFormat = Object.assign(Luxon.DATE_MED, { });


    ///////////////////////////
    // DB
    ///////////////////////////

    const mongo_url = 'mongodb://<user>:<pass>@<host>:<port>/<db>?retryWrites=true&w=majority'
        .replace("<host>", process.env.mongo_host)
        .replace("<port>", process.env.mongo_port)
        .replace("<user>", process.env.mongo_user)
        .replace("<pass>", process.env.mongo_pass)
        .replace("<db>", process.env.mongo_db)

/*
    mongoose.connect(
        mongo_url,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify : false
        },
        (err) => {
            if (err) console.log("Mongoose error? ", err)
            else console.log("Connected to Mongo DB")
        },
    )
*/

    try {
        let dbResult = await mongoose.connect(
            mongo_url,
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify : false
            }
        )
        console.log("Connected to Mongo DB")
        //app.dbConnection = mongoose.connection
    } catch(e) {
        console.log("Mongoose connection error? ", e)
    }

    app.dbDisconnect = () => {
        mongoose.connection.close()
        //app.dbConnection.close()
    }


    ///////////////////////////
    // Models
    ///////////////////////////

    // Load all models
    const models = require('./models')

    for (const model in models) {
        eval(`var ${model} = models[model]`)
    }



    ///////////////////////////
    // Static Routes
    ///////////////////////////

    app.use('/', express.static('frontend/build'))

    routes(app)

    let server

    app.start = () => {
        server = app.listen(port, () => console.log("Listening on port " + port))
    }

    app.stop = () => {
        app.dbDisconnect()
        server.close()
    }

    return app
}

module.exports.createApp = createApp