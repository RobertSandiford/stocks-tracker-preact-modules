import { expect } from 'chai'
import { Luxon } from '../../src/lib/luxon'
import '../testSetup'


log("start HoldingOpenAndClose.test".blue)

import setup from '../setup'
import teardown from '../teardown'

let app
let graphqlRequests

before( async () => {
    const res = await setup()
    app = res.app
    graphqlRequests = res.graphqlRequests
})


describe("The application", () => {
    test('was created', () => {
        expect(app.name).to.equal('app')
    })
})



describe("The addHoldingOpen mutation", () => {

    test('can add a HoldingOpen to a holding', async () => {
       
        try {
            const now = Luxon.local()

            const holdingResult = await graphqlRequests.addHolding({
                holdingInput : {
                    name : "testHolding",
                    ticker : "TTT",
                    quantity : 1,
                    buyUnitPrice : 1,
                    buyTotalPrice : 1,
                    buyDate : now.toISO()
                }
            })

            expect(holdingResult.holding._id).to.not.be.undefined

            const openResult = await graphqlRequests.addHoldingOpen({
                user : 1,
                holdingId : holdingResult.holding._id,
                holdingOpenInput : {
                    quantity : 2,
                    buyUnitPrice : 2,
                    buyTotalPrice : 4,
                    buyDate : now.toISO()
                }
            })

            expect(openResult.holdingOpen).to.not.be.undefined
            
        } catch(e) {
            log( "error".red )
            log( e.name.red )
            log( e.message )
            for ( const x in e ) {
                log(x)
            }
            //log(e)
            requestError(e)
        }

    })
})



describe("The addHoldingClose mutation", () => {

    test('can add a HoldingClose to a Holding', async () => {
       
        try {
            const now = Luxon.local()

            const holdingResult = await graphqlRequests.addHolding({
                holdingInput : {
                    name : "testHolding2",
                    ticker : "TTTT",
                    quantity : 1,
                    buyUnitPrice : 1,
                    buyTotalPrice : 1,
                    buyDate : now.toISO()
                }
            })

            expect(holdingResult.holding._id).to.not.be.undefined

            const closeResult = await graphqlRequests.addHoldingClose({
                user : 1,
                holdingId : holdingResult.holding._id,
                holdingCloseInput : {
                    quantity : 2,
                    sellUnitPrice : 2,
                    sellTotalPrice : 4,
                    sellDate : now.toISO()
                }
            })

            //console.log(closeResult)

            expect(closeResult.holdingId).to.be.equal(holdingResult.holding._id)
            expect(closeResult.holdingClose).to.not.be.undefined

            
        } catch(e) {
            log( e.name.red )
            log( e.message.yellow )
            log( e.stack.blue )
            requestError(e)
        }

    })
})


describe("Retrieving Holdings with opens and closes", () => {

    test(`can retrieve a holding with it's opens and closes`, async () => {
       
        try {

            const now = Luxon.local()

            const holdingResult = await graphqlRequests.addHolding({
                holdingInput : {
                    name : "testHolding2",
                    ticker : "TTTT",
                    quantity : 1,
                    buyUnitPrice : 1,
                    buyTotalPrice : 1,
                    buyDate : now.toISO()
                }
            })

            expect(holdingResult.holding._id).to.not.be.undefined


            const openResult = await graphqlRequests.addHoldingOpen({
                user : 1,
                holdingId : holdingResult.holding._id,
                holdingOpenInput : {
                    quantity : 2,
                    buyUnitPrice : 2,
                    buyTotalPrice : 4,
                    buyDate : now.toISO()
                }
            })

            expect(openResult.holdingOpen).to.not.be.undefined


            const closeResult = await graphqlRequests.addHoldingClose({
                user : 1,
                holdingId : holdingResult.holding._id,
                holdingCloseInput : {
                    quantity : 2,
                    sellUnitPrice : 2,
                    sellTotalPrice : 4,
                    sellDate : now.toISO()
                }
            })

            //console.log(closeResult)

            expect(closeResult.holdingId).to.be.equal(holdingResult.holding._id)
            expect(closeResult.holdingClose).to.not.be.undefined


            const getHoldingResult = await graphqlRequests.getHolding({
                holdingId : holdingResult.holding._id
            })

            expect(getHoldingResult.holding._id).to.not.be.undefined

            //log(getHoldingResult)


        } catch(e) {
            log( e.name.red )
            log( e.message.yellow )
            log( e.stack.blue )
            requestError(e)
        }

    })
})

after( async () => {
    await teardown(app)
})
