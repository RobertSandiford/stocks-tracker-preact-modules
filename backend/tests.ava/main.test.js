
import test from 'ava'

//const assert = require('assert')
import { expect } from 'chai'

import 'colors'
import { createApp } from '../src/app'



console.log("start main.test".blue)


let app

app = await createApp()
await app.start(0)

/*
before( async () => {
    app = await createApp()
    await app.start(0)
})
*/

test('The app was created', async (t) => {
    t.is(app.name, 'app')

    expect(app.name).to.equal('app')

})

/*
after( async () => {
    await app.stop()
})
*/

