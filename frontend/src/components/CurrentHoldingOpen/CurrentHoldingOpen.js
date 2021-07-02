
import { h, Component } from 'preact'

export default CurrentHoldingOpen = reduxConnect(
    null,
    dispatchFunction
)(class CurrentHoldingOpen extends Component {

    //static reduxContext = ReactReduxContext

    constructor(props) {
        super(props)


        this.holdingComponent = this.props.holdingComponent
        this.holding = this.holdingComponent.holding
        this.open = this.props.open

        this.remove = (event) => {
            event.preventDefault()
    
            let data = { 
                holding_id : this.holding._id,
                open_id : this.open._id
            }
            console.log("open remove data", this.holding, this.open, data)
            this.holdingComponent.holdingsComponent.post(
                "http://localhost:4000/holdings/open/remove",
                data,
                (response) => {
                    console.log(response)
                    if (response.status === "OK") {

                        this.props.updateStore("removeHoldingOpen", { holding : this.holding, open : this.open } )
                        /*let opens = this.holding.opens.filter((close) => { 
                            return open._id  !== response.open_id 
                        })
                        console.log("new opens", opens)
                        this.holding.opens = opens*/

                    }
                },
                (error) => {
                    console.log(error)
                })
        }

    }
    
    render() {
        console.log("current holding open render", this.holding._id, this.holding.opens.length)
        
        let holding = this.holding
        let open = this.open


        let displayCurrency = "USD"
        let buyCurrency = holding.buyCurrency

        let fxc = (holding.priceCurrency != displayCurrency)
        let convert = (fxc && holding.buyRate && open.buyRate)

        console.log("holding.priceCurrency", holding.priceCurrency)
        console.log("fxc", fxc)
        console.log("holding.buyRate", holding.buyRate)
        console.log("open.buyRate", open.buyRate)
        console.log("convert", convert)
        
        let buyRate = open.buyRate
        let currentRate = holding.currentRate

        let quantity = open.quantity

        let buyUnitPriceLocal = open.buyUnitPrice
        let buyTotalPriceLocal = buyUnitPriceLocal * quantity
        let buyDate = Luxon.fromISO(open.buyDate)

        let currentUnitPriceLocal = holding.currentUnitPrice
        let currentTotalPriceLocal = currentUnitPriceLocal * quantity
        let currentPriceDate = Luxon.fromISO(holding.currentPriceDate)
        let currentDate = Luxon.local()


        let buyUnitPrice = (convert) ? buyUnitPriceLocal * buyRate : buyUnitPriceLocal
        let buyTotalPrice = (convert) ? buyTotalPriceLocal * buyRate : buyTotalPriceLocal

        /////// Currrent Rate needs to change to time specific rate *****
        let currentUnitPrice = (convert) ? currentUnitPriceLocal * currentRate : currentUnitPriceLocal
        let currentTotalPrice = (convert) ? currentTotalPriceLocal * currentRate : currentTotalPriceLocal

        //console.log(buyUnitPriceLocal, buyUnitPrice)


        let valueChange = currentTotalPrice - buyTotalPrice
        let percentageChange = ((currentTotalPrice / buyTotalPrice) - 1) * 100

        // annum
        let dateDiff = currentDate.diff(buyDate, 'years').toObject().years
        let percentageChangeAnnum = (Math.pow(currentUnitPrice / buyUnitPrice, 1 / dateDiff) -1) * 100 //// annual rate calculated as exponential
        //let percentageChangeAnnumRounded = roundDp(percentageChangeAnnum, 1)

        //// Fees need to be incorporated ********
        let percentageChangeAnnumAfterFees = percentageChangeAnnum // percentageChangeAnnum - fees


        let changeSign = ( (percentageChange > 0) ? "+" : (percentageChange < 0) ? '-' : '' )
        let changeType = ( (changeSign === "+") ? "change-grown" : (changeSign === "-") ? 'change-shrunk' : 'change-neutral' )

        console.log("open info", holding, open, valueChange, currentTotalPrice, buyTotalPrice)

        //// Values formatted for display
        let d = {
            quantity : numToXChars(quantity, 7), //roundDp(closedQuantity, 4)
            buyUnitPriceLocal : formatMoney(buyUnitPriceLocal, holding.buyCurrency),
            buyUnitPrice : formatMoney(buyUnitPrice, displayCurrency),
            buyTotalPriceLocal : formatMoney(buyTotalPriceLocal, holding.buyCurrency),
            buyTotalPrice : formatMoney(buyTotalPrice, displayCurrency),
            buyDate : buyDate.toLocaleString(stDateFormat),

            currentUnitPriceLocal : formatMoney(currentUnitPriceLocal, holding.buyCurrency),
            currentUnitPrice : formatMoney(currentUnitPrice, displayCurrency),
            currentTotalPriceLocal : formatMoney(currentTotalPriceLocal, holding.buyCurrency),
            currentTotalPrice : formatMoney(currentTotalPrice, displayCurrency),
            currentDate : currentDate.toLocaleString(stDateFormat),

            valueChange : formatMoney(valueChange, displayCurrency),
            percentageChange : formatPercentage(percentageChange),
            percentageChangeAnnum : formatPercentage(percentageChangeAnnum),

            valueChangeAfterFees : formatMoney(valueChange, displayCurrency),
            percentageChangeAfterFees : formatPercentage(percentageChange),
            percentageChangeAnnumAfterFees : formatPercentage(percentageChangeAnnumAfterFees),

            timeHeld : (typeof dateDiff === "number") ? dateDiff.toFixed(2) + " years" : "" ,
            
            changeSign : changeSign,
            changeType : changeType
        }


        console.log("open info 2", valueChange, d.valueChange, d.valueChangeAfterFees)

        //console.log("render", this.state.edit)
        return (
             <div class="closed-summary">
                <span style={HoldingStyle.controls}></span>
                <span style={HoldingStyle.title}>Open: </span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.span} title={quantity}>{d.quantity}</span>
                <span style={HoldingStyle.span} title={ (fxc) ? d.buyUnitPriceLocal : '' }>{d.buyUnitPrice}</span>
                <span style={HoldingStyle.span} title={ (fxc) ? d.buyTotalPriceLocal : '' }>{d.buyTotalPriceLocal}</span>
                <span style={HoldingStyle.date}>{d.buyDate}</span>
                <span style={HoldingStyle.fees}>{}</span>
                <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? d.currentUnitPriceLocal : "" }>{d.currentUnitPrice}</span>

                <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? d.currentTotalPriceLocal : "" }>
                    {d.currentTotalPrice}
                </span>

                <span style={HoldingStyle.span}>
                    {d.currentDate}
                </span>

                { (fees !== 0)
                    ? <span style={HoldingStyle.span} className={changeType} title={d.currentDate}>
                        {d.valueChangeAfterFees}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.currentDate}>
                        {d.valueChange}
                    </span>
                }

                { (fees !== 0)
                    ? <span style={HoldingStyle.span} className={changeType} title={d.currentDate}>
                        {d.percentageChangeAfterFees}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.currentDate}>
                        {d.percentageChange}
                    </span>
                }

                { (fees !== 0)
                    ? <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={d.currentDate}>
                       { (dateDiff > 0.1) ? d.percentageChangeAnnumAfterFees : <span>-</span> }
                    </span>
                    : <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={d.currentDate}>
                        { (dateDiff > 0.1) ? d.percentageChangeAnnum : <span>-</span> }
                    </span>
                }

                <span style={HoldingStyle.timeHeld}>{d.timeHeld}</span>
                
                <span style={HoldingStyle.deleteSpan}>
                    <button style={HoldingStyle.editButton} title="Edit" onClick={this.edit}>e</button>
                    <button style={HoldingStyle.deleteButton} title="Delete Completely" onClick={this.remove}>x</button>
                </span>
            </div>
        )
    }
})