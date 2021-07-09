
//const assert = require('assert')
import { expect } from 'chai'

import 'colors'
import { createApp } from '../src/app'



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
