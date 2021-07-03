const express = require('express')
const supertest = require('supertest')
const { createApp } = require('../src/app')

let app

beforeAll( async () => {
    app = await createApp()
})

describe("The application", () => {
    test('was created', () => {
        expect(app.name).toBe('app')
    })
})

afterAll( async () => {
    app.dbDisconnect()
})
