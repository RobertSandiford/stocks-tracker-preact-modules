
//const assert = require('assert')
const expect = require('chai').expect
require('colors')
const { createApp } = require('../src/app')


console.log("start main.test".blue)


let app
before( async () => {
    app = await createApp()
    await app.start(0)
})

describe("The application", () => {
    it('was created', async () => {
        expect(app.name).to.equal('app')
    })
})

after( async () => {
    await app.stop()
})
