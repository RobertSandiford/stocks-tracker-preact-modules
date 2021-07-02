// package imports
import { h, Component } from 'preact'
import { connect as reduxConnect } from 'react-redux'
import { dispatchFunction as reduxDispatchFunction, getStoreItems } from '../../redux/functions'
import { gql } from '@apollo/client';

// project dependencies
import graph from '../../graph'
import { objectWithTheseFields } from '../functions'

// components
import CurrentHolding from '../CurrentHolding/CurrentHolding'
import GroupSummary from '../GroupSummary/GroupSummary'
import HoldingsSorter from '../HoldingsSorter/HoldingsSorter'
import CurrentHoldingHeadings from '../CurrentHoldingHeadings/CurrentHoldingHeadings'
import CurrentHoldingTotals from '../CurrentHoldingTotals/CurrentHoldingTotals'

export default reduxConnect(
    state => ({
        apolloClient : state.apolloClient,
        holdings : state.holdings
    }),
    reduxDispatchFunction
)(class CurrentHoldings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sort : {
                1 : "group",
                2 : "",
                3 : ""
            }
        }

        this.totalsDefault = {
            buyValue : 0,
            currentValue : 0,
            change : 0
        }

        this.componentDidMount = () => {
            // load data on first load
            this.getHoldings()
        }

        this.getHoldings = () => {
            
            console.log("Try to get holdings")
            
            let query = `query GetHoldings {
                getHoldings(
                    user: 1
                    displayCurrency : "USD"
                    secondCurrency : "GBP"
                ) {
                    status
                    holdings ${graph.Holding}
                    groups
                    fx ${graph.Fx}
                }
            }`


            // load holdings
            this.props.apolloClient.query({ query: gql(query) })
            .then( result => {
                console.log("graphql holdings", result.data)
                let r = result.data.getHoldings

                if ( r !== null ) {
                    let s = objectWithTheseFields(r, ["holdings", "groups", "fx"])
                    console.log("update store 1", s)
                    this.props.updateStore(s)
                } else {

                }
            });
        }
        
        this.sort = function(holdings) {
            let sort = this.state.sort

            let newHoldings = _.cloneDeep(holdings)

            let propComp3Way = function(prop1, prop2, prop3, dir = 1) {

                let prop1Comp = (a, b) => {
                    let aa = a[prop1] || ""
                    let bb = b[prop1] || ""
                    //console.log(aa, bb, a[prop1] > b[prop1], a[prop1] < b[prop1])
                    if (aa > bb) return 1 * dir
                    if (aa < bb) return -1 * dir
                    return 0
                }
                let prop2Comp = (a, b) => {
                    let aa = a[prop2] || ""
                    let bb = b[prop2] || ""
                    if (aa > bb) return 1 * dir
                    if (aa < bb) return -1 * dir
                    return 0
                }
                let prop3Comp = (a, b) => {
                    let aa = a[prop3] || ""
                    let bb = b[prop3] || ""
                    if (aa > bb) return 1 * dir
                    if (aa < bb) return -1 * dir
                    return 0
                }

                return (a, b) => {
                    
                    if (prop1 === "") return 0

                    // check prop 1
                    let p1
                    if ( (p1 = prop1Comp(a, b)) !== 0 ) return p1 * dir

                    if (prop2 === "") return 0
                
                    // check prop 2
                    let p2
                    if ( (p2 = prop2Comp(a, b)) !== 0 ) return p2 * dir

                    if (prop3 === "") return 0
                
                    // check prop 3
                    let p3
                    if ( (p3 = prop3Comp(a, b)) !== 0 ) return p3 * dir

                    // otherwise, return equal
                    return 0
                }
            }
            
            return newHoldings.sort( propComp3Way(sort[1], sort[2], sort[3]) )

        }.bind(this)

    }  

    render() {
        console.log("render current holdings")

        this.totals = _.cloneDeep(this.totalsDefault)

        if (this.props.holdings.length == 0) return <div id="show-holdings" /> // show nothing until we have holdings

        let holdings = this.sort(this.props.holdings)
        
        let sort = this.state.sort

        let lastSortValue = {
        }
        
        let identity = {}
        let title = {}

        let defaultIdentity = "__NONE"
        let defaultTitle = "__"

        for (let i = 1; i <= 3; i++) {
            if (sort[i] !== "") {

                lastSortValue[i] = ( holdings[0][sort[i]] ) ? holdings[0][sort[i]].toLowerCase() : defaultIdentity
                title[i] = holdings[0][sort[i]] || defaultTitle
                //console.log(i, lastSortValue)

            }
        }

        let currentHoldings = []
        for (const [index, holding] of holdings.entries()) {

            //console.log("holding", holding["name"], holding)
            currentHoldings.push(<CurrentHolding totals={this.totals} sorts={sort} holdingsComponent={this.props.holdingsComponent} key={holding._id} holding={holding} />)
            
            
            for (let i = 3; i >= 1; i--) {

                if (sort[i] !== "") {

                    let sortValue
                    let nextTitle

                    console.log("undefined nextHolding.group error debug 1", holding)

                    if (index == holdings.length -1) {
                        sortValue = "__LAST_ONE"
                    }
                    else {
                        let nextHolding = holdings[index + 1]
                        console.log("undefined nextHolding.group error debug 2", nextHolding)
                        sortValue = (nextHolding[sort[i]]) ? nextHolding[sort[i]].toLowerCase() : defaultIdentity
                        nextTitle = (nextHolding[sort[i]]) || defaultTitle
                    }

                    if (sortValue != lastSortValue[i]) {

                        let thisIdentity = {}
                        let thisTitle = {}
                        for (let j = 1; j <= i; j++) {
                            thisIdentity[j] = lastSortValue[j]
                            thisTitle[j] = title[j]
                        }

                        let key = Object.values(thisIdentity).join("-")

                        currentHoldings.push(<GroupSummary key={key} title={_.cloneDeep(thisTitle)} identity={_.cloneDeep(thisIdentity)} totals={this.totals} sorts={sort} />)
                        
                        lastSortValue[i] = sortValue
                        title[i] = nextTitle
                        
                    }
                    
                }
            }

        }
        return (
            <div id="show-holdings">
                <h3>Holdings</h3>
                <HoldingsSorter holdingsComponent={this.props.holdingsComponent} currentHoldingsComponent={this} />
                <CurrentHoldingHeadings />
                {currentHoldings}
                <CurrentHoldingTotals holdingsComponent={this.props.holdingsComponent} currentHoldingsComponent={this} totals={this.totals} />
            </div>
        )
    }
})
