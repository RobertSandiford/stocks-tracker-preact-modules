
import { createApp } from '../src/app'
import { requests as graphqlRequests } from '../src/graph'

export default async () => {
    const app = await createApp()
    const port = await app.start(0)
    const graphqlEndpoint = `http://localhost:${port}/graphql`
    graphqlRequests.configure(graphqlEndpoint)
    return { app, graphqlRequests }
}
