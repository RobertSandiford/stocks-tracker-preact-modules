const { createApp } = require('../src/app')
const setup = require('./setup')
const teardown = require('./teardown')

let app


beforeAll( async () => {
    app = await createApp()
    app.start()
})


describe("The application", () => {
    test('was created', () => {
        expect(app.name).toBe('app')
    })
})


afterAll( async () => {
    app.stop()
})
