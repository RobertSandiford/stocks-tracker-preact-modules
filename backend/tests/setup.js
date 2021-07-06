
const { createApp } = require('../src/app')

const port = (Number(process.env.port) + 1) || console.log("Error, no port specified in .env")

console.log("Running setup module")

module.exports = async () => {
    const app = await createApp()
    app.start(port)
    return app
};