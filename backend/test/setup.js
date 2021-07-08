
const { createApp } = require('../src/app')
const { requests : graphqlRequests } = require('../src/graph')

module.exports = async () => {
    const app = await createApp()
    const port = await app.start(0)
    const graphqlEndpoint = `http://localhost:${port}/graphql`
    graphqlRequests.configure(graphqlEndpoint)
    return { app, graphqlRequests }
}