
import { Component } from 'preact'
import { connect as reduxConnect, useSelector, useDispatch } from 'react-redux'
import { dispatchFunction as reduxDispatchFunction, getStoreItems } from '../../redux/functions'

import CurrentHoldingOpenForm from '../CurrentHoldingOpenForm/CurrentHoldingOpenForm'
import CurrentHoldingCloseForm from '../CurrentHoldingCloseForm/CurrentHoldingCloseForm'

let CurrentHolding
export default CurrentHolding = reduxConnect(
    getStoreItems(['displayCurrency']),
    reduxDispatchFunction
)(class CurrentHolding extends Component {
    constructor(props) {
        super(props)

        this.holdingsComponent = this.props.holdingsComponent

        this.state = {
            edit : false,
            open : false,
            close : false
        }

        this.editCurrentUnitPrice = createRef()
        this.editCurrentTotalPrice = createRef()

        //this.holding = {...this.props.holding}
        this.init(this.props)
    
    }

    getDerivedStateFromProps(newPops) {
        console.log("get Derived state +++ ")
        //return newState
    }


    init = props => {
        this.holding = {...props.holding}
    }

    keyPressUnitPrice = (event) => {
        if(event.key !== 'Enter') return
        let v = event.target.value
        v = getPriceWithoutCurrency(v)
        if ( ! isNaN(v) ) { // seems to be a valid number
            this.holding["currentUnitPrice"] = Number(v)
            this.forceUpdate()
            this.updateHolding()
        }
    }
    keyPressTotalPrice = (event) => {
        if(event.key !== 'Enter') return
        let v = event.target.value
        v = getPriceWithoutCurrency(v)
        if ( ! isNaN(v) ) { // seems to be a valid number
            this.holding["currentUnitPrice"] = Number(v) / this.holding.quantity
            this.forceUpdate()
            this.updateHolding()
        }
    }
    
    updateHolding = () => {
        let data = this.holding
        //console.log("data to upload", data)
        this.props.holdingsComponent.post(
            "http://localhost:4000/holdings/update",
            data,
            (response) => {
                console.log("update holding response", response)
                if (response.status === "OK") {
                    //
                    this.props.updateStore("updateHolding", response.holding)
                }
            },
            (error) => {
                console.log(error)
            })
    }

    edit = (event) => {
        this.setState({ edit : !this.state.edit })
    }

    editChange = (event) => {
        let el = event.target
        //console.log(el.name, el.value)
        switch(el.name) {
            case "buyUnitPrice":
            case "buyTotalPrice":
                let m = parseMoney(el.value)
                //console.log(el.value,m)
                this.holding[el.name] = Number(m)
                break
            case "buyUnitCurrency":
            case "buyTotalCurrency":
                this.holding.buyCurrency = el.value
                break
            case "currentUnitPrice":
                let v = el.value
                v = parseMoney(v)
                if ( ! isNaN(v) ) { // seems to be a valid number
                    this.holding["currentUnitPrice"] = Number(v)
                    this.editCurrentTotalPrice.current.value = addCurrencySign(Number(v) * this.holding.quantity, this.holding.buyCurrency)
                    this.holding.currentPriceDate = Luxon.local().toISO()
                    //console.log("U currentUnitPrice", this.holding["currentUnitPrice"])
                    //this.forceUpdate()    
                }
                break
            case "currentTotalPrice":
                let w = el.value
                w = parseMoney(w)
                if ( ! isNaN(w) ) { // seems to be a valid number
                    this.holding["currentUnitPrice"] = Number(w) / this.holding.quantity
                    this.editCurrentUnitPrice.current.value = addCurrencySign(this.holding["currentUnitPrice"], this.holding.buyCurrency)
                    this.holding.currentPriceDate = Luxon.local().toISO()
                    //console.log("T currentUnitPrice", this.holding["currentUnitPrice"])
                    //this.forceUpdate()
                }
                break
            default:
                this.holding[el.name] = el.value
                //console.log(el.name + "= ", el.value)
                //console.log(this.holding)
                break
        }
    }
    save = (event) => {
        this.updateHolding()
        this.setState({edit : false})
    }
    open = (event) => {
        this.setState({ open : !this.state.open })
    }
    close = (event) => {
        this.setState({ close : !this.state.close })
    }
    render = () => {
        this.init(this.props)

        let displayCurrency = this.props.displayCurrency
        //console.log("current holding render", this.props, this.holding.opens.length, this.holding.closes.length, this.holding)
        //console.log("render", this.holding.name)

        let holding = this.holding

        //// get summaries for the holding
        let holdingSummary = { 
            quantity : 0,
            buyTotalPrice : 0,
            buyUnitPrices : [],
            averageBuyPrice : 0,
            averageBuyPrice2 : 0
        }
        // opens, including the original open encoded into the holding obj
        for ( const o of [holding, ...holding.opens] ) {
            holdingSummary.quantity += o.quantity
            let buyUnitPrice = (holding.buyCurrency == displayCurrency) ? o.buyUnitPrice : o.buyUnitPrice * o.buyRate
            let buyTotalPrice = (holding.buyCurrency == displayCurrency) ? o.buyTotalPrice : o.buyTotalPrice * o.buyRate
            console.log("buyTotalPrice", holding, holding.buyCurrency, displayCurrency, holding.buyCurrency == displayCurrency, o.buyTotalPrice, buyTotalPrice)
            holdingSummary.buyTotalPrice += buyTotalPrice
            holdingSummary.buyUnitPrices.push({ quantity : o.quantity, buyUnitPrice : buyUnitPrice })
        }
        // closes
        for ( const c of holding.closes ) {
            holdingSummary.quantity -+ c.quantity
        }
        // work out average buy price
        let sumBoughtQuantity = 0
        let sumBoughtPrice = 0
        for ( const { quantity, buyUnitPrice } of holdingSummary.buyUnitPrices ) {
            sumBoughtQuantity += quantity
            holdingSummary.averageBuyPrice += buyUnitPrice * quantity
        }
        holdingSummary.averageBuyPrice /= sumBoughtQuantity

        console.log("hs", holdingSummary)

        let buyCurrency = holding.buyCurrency
        let priceCurrency = holding.priceCurrency
        let fxc = (holding.priceCurrency != displayCurrency)
        let convert = (fxc && holding.buyRate && holding.currentRate)

        console.log("convert", convert)

        let buyRate = holding.buyRate
        //let buyRate = Number(holding.buyRate)
        //let buyRate = holding.buyRate[displayCurrency]
        let currentRate = holding.currentRate
        //let currentRate = Number(holding.currentRate
        //let currentRate = holding.currentRate[displayCurrency]

        let title = (holding.custom)
            ? holding.name + " (Custom)"
            : holding.name + " (" + holding.ticker + ")"
        let type = holding.type || ""
        let group = holding.group || ""
        let region = holding.region || ""

        let buyDate = Luxon.fromISO(holding.buyDate)
        //let buyDate = Luxon.fromMillis(parseInt(holding.buyDate))

        let quantity = holding.quantity

        let remainingQuantity = quantity
        let closedTotalPrice = 0
        if (holding.closes) {
            for (const c of holding.closes) {
                remainingQuantity -= c.quantity
                closedTotalPrice += c.sellTotalPrice
            }
        }

        //let buyPrice = holding.buyPrice ? holding.buyPrice : ""
        let buyPriceLocal = holding.buyUnitPrice ? holding.buyUnitPrice : (holding.buyPrice ? holding.buyPrice : "")
        //let buyValueLocal = ( ! isNaN(buyPriceLocal) ) ? quantity * buyPriceLocal : ""
        let buyValueLocal = ( ! isNaN(buyPriceLocal) ) ? remainingQuantity * buyPriceLocal : ""

        let buyPrice = ""
        let buyValue = ""
        if (convert) {
            buyPrice = buyPriceLocal * (1 * buyRate)
            buyValue = buyValueLocal * (1 * buyRate)
        }  else {
            buyPrice = buyPriceLocal
            buyValue = buyValueLocal
        }
        //console.log(holding.name)
        //console.log("XXXX", buyPriceLocal, buyValueLocal)
        //console.log("AAAA", buyPriceLocal, buyPrice, /*(fxc) ? buyRate : ''*/)
        //console.log("BBBB", buyValueLocal, buyValue, /*(fxc) ? buyRate : ''*/)

        let currentUnitPriceLocal = holding.currentUnitPrice || ""
        let currentPriceDate = Luxon.fromISO(holding.currentPriceDate)
        //let currentPriceDate = Luxon.fromMillis(parseInt(holding.currentPriceDate))
        let currentValueLocal = ( ! isNaN(currentUnitPriceLocal) ) ? remainingQuantity * currentUnitPriceLocal : ""
        

        //currentValueLocal += closedTotalPrice

        let currentUnitPrice = ""
        let currentValue = ""
        if (convert) {
            currentUnitPrice = currentUnitPriceLocal * currentRate
            currentValue = currentValueLocal * currentRate
        }  else {
            currentUnitPrice = currentUnitPriceLocal
            currentValue = currentValueLocal
        }

        //console.log("RV", remainingQuantity, currentValueLocal, currentValue)

        //console.log("currentValue", currentValue)
        //console.log("CV", currentValue)

        let fees = holding.fees || 0

        let valueChange = currentValue - buyValue

        let percentageChange = ((currentValue / buyValue) - 1) * 100
        //let percentageChangeRounded = roundDp(percentageChange, 1)
        let changeSign = ( (percentageChange > 0) ? "+" : (percentageChange < 0) ? '-' : '' )
        //let changeSign = ( (percentageChangeRounded > 0) ? "+" : (percentageChangeRounded < 0) ? '-' : '' )
        let changeType = ( (changeSign === "+") ? "change-grown" : (changeSign === "-") ? 'change-shrunk' : 'change-neutral' )
     
        let buyDateIso = holding.buyDate
        let buyDateTime = Luxon.fromISO(buyDateIso)
        let buyDateLocal = buyDateTime.toFormat(luxonLocalFormat)
        let dateDiff = Luxon.local().diff(buyDateTime, 'years').toObject().years
        let timeHeld = dateDiff
        //let percentageChangeAnnum = percentageChange / (currentPriceDate.diff(Luxon.local()));

        //let percentageChangeAnnum = (percentageChange / dateDiff) //// annual rate calculated flat
        let percentageChangeAnnum = (Math.pow(currentUnitPrice / buyPrice, 1 / dateDiff) -1) * 100 //// annual rate calculated as exponential
        //let percentageChangeAnnumRounded = roundDp(percentageChangeAnnum, 1)


        let percentageChangeAnnumAfterFees = percentageChangeAnnum
        let percentageChangeAfterFees = percentageChange
        let currentUnitPriceAfterFees = currentUnitPrice
        let currentValueAfterFees = currentValue
        let valueChangeAfterFees = valueChange

        if (fees > 0 && dateDiff > 0) {
            percentageChangeAnnumAfterFees = percentageChangeAnnum - fees
            percentageChangeAfterFees = (Math.pow( 1 + percentageChangeAnnumAfterFees/100, timeHeld ) -1) * 100
            currentUnitPriceAfterFees = buyPrice * Math.pow( 1 + percentageChangeAnnumAfterFees/100, timeHeld )
            currentValueAfterFees = currentUnitPriceAfterFees * remainingQuantity
            valueChangeAfterFees = (currentUnitPriceAfterFees - buyPrice) * remainingQuantity
        }

        console.log("curr val after fees", currentValueAfterFees, buyValue, Math.pow( 1 + percentageChangeAnnumAfterFees/100, timeHeld ))
        //// redoing change after fees here
        changeSign = ( (percentageChangeAfterFees > 0) ? "+" : (percentageChangeAfterFees < 0) ? '-' : '' )
        changeType = ( (changeSign === "+") ? "change-grown" : (changeSign === "-") ? 'change-shrunk' : 'change-neutral' )



        let totals = this.props.totals
        let sorts = this.props.sorts

        totals.buyValue     += buyValue
        totals.currentValue += currentValueAfterFees
        totals.change       += valueChangeAfterFees
        totals.count        = (totals.count || 0) + 1 

        let subTotals = totals

        for (let i = 1; i <= 3; i++) {

            let criteria = sorts[i]
            if (criteria === "") break

            let group = (holding[criteria] || "").toLowerCase() || "__NONE"

            if (typeof subTotals[group] === "undefined") {
                subTotals[group] = { buyValue : 0, currentValue : 0, change : 0 }
            }
            subTotals = subTotals[group]
            subTotals.buyValue      += buyValue
            subTotals.currentValue  += currentValueAfterFees
            subTotals.change        += valueChangeAfterFees
            subTotals.count         = (subTotals.count || 0) + 1 
            
        }

        //console.log("totals", totals)

        //console.log(totals.buyValue, totals.currentValue, totals.change)

        ////////////////////////////////////
        // display formatting
        /////////////////////////   ///////////
        //console.log("buyPriceLocal",buyPriceLocal)
        let quantityDisplay = numToXChars(remainingQuantity,7)
        if (buyPriceLocal) buyPriceLocal = formatMoney(buyPriceLocal, holding.buyCurrency)
        if (buyValueLocal) buyValueLocal = formatMoney(buyValueLocal, holding.buyCurrency)
        
        if (convert) {
            if (buyPrice) buyPrice = formatMoney(buyPrice, displayCurrency)
            if (buyValue) buyValue = formatMoney(buyValue, displayCurrency)
        } else {
            if (buyPrice) buyPrice = formatMoney(buyPrice, holding.buyCurrency)
            if (buyValue) buyValue = formatMoney(buyValue, holding.buyCurrency)
        }

        buyDate = buyDate.toLocaleString(stDateFormat)

        let feesDisplay = holding.fees

        let currentUnitPriceLocalDisplay
        let currentValueLocalDisplay

        if (currentUnitPriceLocal) currentUnitPriceLocalDisplay = formatMoney(currentUnitPriceLocal, holding.priceCurrency)
        if (currentValueLocal) currentValueLocalDisplay = formatMoney(currentValueLocal, holding.priceCurrency)


        if (convert) {
            if (currentUnitPrice) currentUnitPrice = formatMoney(currentUnitPrice, displayCurrency)
            if (currentValue) currentValue = formatMoney(currentValue, displayCurrency)
        } else {
            if (currentUnitPrice) currentUnitPrice = formatMoney(currentUnitPrice, holding.buyCurrency)
            if (currentValue) currentValue = formatMoney(currentValue, holding.buyCurrency)
        }
        //console.log("curr v2", currentValue)

        let currentPriceDateDisplay = currentPriceDate.toLocaleString(stDateFormat)



        if (valueChange) valueChange = formatMoney(valueChange)
        let percentageChangeDisplay = percentageFormat(percentageChange, changeSign)
        let percentageChangeAnnumDisplay = percentageFormat(percentageChangeAnnum, changeSign)

        let percentageChangeAnnumAfterFeesDisplay = percentageFormat(percentageChangeAnnumAfterFees, changeSign)
        let percentageChangeAfterFeesDisplay = percentageFormat(percentageChangeAfterFees, changeSign)

        let currentUnitPriceAfterFeesDisplay = formatMoney(currentUnitPriceAfterFees)
        let currentValueAfterFeesDisplay = formatMoney(currentValueAfterFees)
        let valueChangeAfterFeesDisplay = formatMoney(valueChangeAfterFees)

        if (remainingQuantity == 0) {
            percentageChangeDisplay = ""
            percentageChangeAnnumDisplay = ""
            percentageChangeAnnumAfterFeesDisplay = ""
            percentageChangeAfterFeesDisplay = ""
            currentValueAfterFeesDisplay = ""
            valueChange = ""
            valueChangeAfterFeesDisplay = ""
        }

        //console.log("th", timeHeld)
        let timeHeldDisplay = (typeof timeHeld === "number") ? timeHeld.toFixed(2) + " years" : ""

        console.log(holdingSummary)
        let d = {
            quantity : numToXChars(holdingSummary.quantity,7),
            averageBuyPrice : formatMoney(holdingSummary.averageBuyPrice, displayCurrency),
            buyTotalPrice : formatMoney(holdingSummary.buyTotalPrice, displayCurrency)
        }

        //console.log("ccc", typeof this.holding.closes, this.holding.closes);
        //console.log("render", this.state.edit)
        return (
            <div style={HoldingStyle.holding} className="holding">
                { ( ! this.state.edit ) // Normal Line else Edit Line
                    ?   <div key="line" class="holding-line">
                            <span style={HoldingStyle.controls}></span>
                            <span style={HoldingStyle.title}>{title}</span>
                            <span style={HoldingStyle.type}>{type}</span>
                            <span style={HoldingStyle.type}>{group}</span>
                            <span style={HoldingStyle.type}>{region}</span>
                            <span style={HoldingStyle.span} title={remainingQuantity}>{d.quantity}</span>
                            <span style={HoldingStyle.span} title={ (fxc) ? buyPriceLocal : '' }>{d.averageBuyPrice}</span>
                            <span style={HoldingStyle.span} title={ (fxc) ? buyValueLocal : '' }>{d.buyTotalPrice}</span>
                            <span style={HoldingStyle.date}>{buyDate}</span>
                            <span style={HoldingStyle.fees}>{feesDisplay}</span>
                            {
                                (holding.type == "custom")
                                    ?   <span style={HoldingStyle.span} className={changeType} title={currentPriceDateDisplay}>
                                            <input name="currentPrice" style={HoldingStyle.editBox}
                                                key={"value" + currentUnitPrice} // hack to make it update default value,
                                                // by making it treat it as a new element if the defautl value has changed
                                                defaultValue={currentUnitPriceAfterFeesDisplay}
                                                onKeyPress={this.keyPressUnitPrice} />
                                        </span>
                                    :   <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? currentUnitPriceLocal : "" }>
                                            {currentUnitPriceAfterFeesDisplay}
                                        </span>
                            }
            
                            {
                                (holding.type == "custom")
                                    ?   <span style={HoldingStyle.span} className={changeType} title={currentPriceDateDisplay}>
                                            <input name="currentValue" style={HoldingStyle.editBox}
                                                key={"value" + currentValue} // hack to make it update default value,
                                                // by making it treat it as a new element if the defautl value has changed
                                                defaultValue={currentValueAfterFeesDisplay}
                                                onKeyPress={this.keyPressTotalPrice} />
                                        </span>
                                    :   <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? currentValueLocal : "" }>
                                            {currentValueAfterFeesDisplay}
                                        </span>
                            }
            
                            <span style={HoldingStyle.span}>
                                {currentPriceDateDisplay}
                            </span>
            
                            { (fees !== 0)
                                ? <span style={HoldingStyle.span} className={changeType} title={currentPriceDateDisplay}>
                                    {valueChangeAfterFeesDisplay}
                                </span>
                                : <span style={HoldingStyle.span} className={changeType} title={currentPriceDateDisplay}>
                                    {valueChange}
                                </span>
                            }
            
                            { (fees !== 0)
                                ? <span style={HoldingStyle.span} className={changeType} title={currentPriceDateDisplay}>
                                    {percentageChangeAfterFeesDisplay}
                                </span>
                                : <span style={HoldingStyle.span} className={changeType} title={currentPriceDateDisplay}>
                                    {percentageChangeDisplay}
                                </span>
                            }

                            { (fees !== 0)
                                ? <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={currentPriceDateDisplay + "\n" + "before fees: " + percentageChangeAnnumDisplay}>
                                    { (timeHeld > 0.1) ? percentageChangeAnnumAfterFeesDisplay : <span>-</span> }
                                </span>
                                : <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={currentPriceDateDisplay}>
                                    { (timeHeld > 0.1) ? percentageChangeAnnumDisplay : <span>-</span> }
                                </span>
                            }
            
                            { (timeHeld < 1)
                                ?  <span style={{...HoldingStyle.timeHeld, ...HoldingStyle.shortTimeHeld}} title="Held for a short period - yearly percentages not a long term indication">
                                    {timeHeldDisplay}
                                </span>
                                :  <span style={HoldingStyle.timeHeld}>
                                    {timeHeldDisplay}
                                </span>
                            }
                           
                            <span style={HoldingStyle.deleteSpan}>
                                <button style={HoldingStyle.editButton} title="Edit" onClick={this.edit}>e</button>
                                <button style={HoldingStyle.openButton} title="Open/Add" onClick={this.open}>{(this.state.open) ? '(+)' : '+' }</button>
                                <button style={HoldingStyle.closeButton} title="Close/Reduce" onClick={this.close}>{(this.state.close) ? '(-)' : '-' }</button>
                                <button style={HoldingStyle.deleteButton} title="Delete Completely" onClick={ (event) => this.props.holdingsComponent.removeHolding(holding._id, event) }>x</button>
                            </span>
                        </div>

                    :   <div key="edit" class="holding-line">
                            <span style={HoldingStyle.controls}></span>
                            <span style={HoldingStyle.title}>
                                <input name="name" style={editLineStyles.inputTitle} defaultValue={holding.name} onChange={this.editChange} />
                                <input name="ticker" style={editLineStyles.inputTicker} defaultValue={holding.ticker} placeholder="Symbol/Code" onChange={this.editChange} />
                            </span>
                            <span style={HoldingStyle.type}>
                                <select name="type" style={editLineStyles.inputType} onChange={this.editChange}>
                                    <option value="stock">Stock</option>
                                    <option value="crypto">Crypto</option>
                                    <option value="currency">Currency</option>
                                    <option value="fund">Fund</option>
                                    <option value="custom">Custom Fund</option>
                                    <option value="pot">Pot</option>
                                </select>
                            </span>
                            <span style={HoldingStyle.type}>
                                <input name="group" style={editLineStyles.input} defaultValue={group} onChange={this.editChange} />
                            </span>
                            <span style={HoldingStyle.type}>
                                <input name="region" style={editLineStyles.input} defaultValue={region} onChange={this.editChange} />
                            </span>
                            <span style={HoldingStyle.span} title={quantity}>
                                <input name="quantity" style={editLineStyles.input} defaultValue={quantity} onChange={this.editChange} />
                            </span>

                            <span style={HoldingStyle.span} title={ (fxc) ? buyPriceLocal : '' }>
                                <input name="buyUnitPrice" style={editLineStyles.input} defaultValue={buyPriceLocal} onChange={this.editChange} />
                                <input name="buyUnitCurrency" style={editLineStyles.input} defaultValue={buyCurrency} onChange={this.editChange} />
                            </span>
                            <span style={HoldingStyle.span} title={ (fxc) ? buyValueLocal : '' }>
                                <input name="buyTotalPrice" style={editLineStyles.input} defaultValue={buyValueLocal} onChange={this.editChange} />
                                <input name="buyTotalCurrency" style={editLineStyles.input} defaultValue={buyCurrency} onChange={this.editChange} />
                            </span>
                            <span style={HoldingStyle.date}>
                                <input name="buyDate" type="datetime-local" style={editLineStyles.inputDate} defaultValue={buyDateLocal} onChange={this.editChange} />
                            </span>
                       
                            <span style={HoldingStyle.fees}>
                                <input name="fees" style={editLineStyles.inputFees} defaultValue={feesDisplay} onChange={this.editChange} />
                            </span>

                            {
                                (holding.type == "custom")
                                    ?   <span key="edit-current-unit-price" style={HoldingStyle.span}>
                                            <input name="currentUnitPrice" style={HoldingStyle.editBox}
                                                key={"edit-current-unit-price-" + currentUnitPrice} // hack to make it update default value,
                                                // by making it treat it as a new element if the defautl value has changed
                                                ref={this.editCurrentUnitPrice}
                                                defaultValue={currentUnitPriceLocalDisplay}
                                                onChange={this.editChange} /*onKeyPress={this.keyPressUnitPrice}*/ />
                                        </span>
                                    :   <span style={HoldingStyle.span}>
                                            Priced In<br />
                                            <input name="priceCurrency" style={editLineStyles.input} defaultValue={priceCurrency} onChange={this.editChange} />
                                        </span>
                            }
            
                            {
                                (holding.type == "custom")
                                    ?   <span key="edit-current-total-price" style={HoldingStyle.span}>
                                            <input name="currentTotalPrice" style={HoldingStyle.editBox}
                                                key={"edit-current-total-price-" + currentValue} // hack to make it update default value,
                                                // by making it treat it as a new element if the defautl value has changed
                                                ref={this.editCurrentTotalPrice}
                                                defaultValue={currentValueLocalDisplay}
                                                onChange={this.editChange} /*onKeyPress={this.keyPressTotalPrice}*/ />
                                        </span>
                                    :   <span style={HoldingStyle.span}></span>
                            }

                            <span style={HoldingStyle.span}></span>
            
                            <span style={HoldingStyle.span}></span>

                            <span style={HoldingStyle.span}></span>
            
                            <span style={HoldingStyle.percentAnnumWidth}></span>
            
                            <span style={HoldingStyle.timeHeld}>
                            </span>
            
                            <span style={HoldingStyle.deleteSpan}>
                                <button style={HoldingStyle.saveButton} title="Save" onClick={this.save}>s</button>
                                <button style={HoldingStyle.editButton} title="Edit" onClick={this.edit}>(e)</button>
                                <button style={HoldingStyle.openButton} title="Open/Add" onClick={this.open}>+</button>
                                <button style={HoldingStyle.closeButton} title="Close/Reduce" onClick={this.close}>-</button>
                                <button style={HoldingStyle.deleteButton} title="Delete Completely" onClick={ (event) => this.props.holdingsComponent.removeHolding(holding._id, event) }>x</button>
                            </span>
                        </div>
                }
                { this.holding.opens && this.holding.opens.length > 0 && [<CurrentHoldingOpen key={this.holding._id} open={this.holding} holdingComponent={this} totals={totals} />, ...Object.values(this.holding.opens).map( x => <CurrentHoldingOpen key={x._id} open={x} holdingComponent={this} totals={totals} />)] }
                { this.holding.closes && this.holding.closes.length > 0 && Object.values(this.holding.closes).map( x => <CurrentHoldingClose key={x._id} close={x} holdingComponent={this} totals={totals} />) }
                { this.holding.closes  && this.holding.closes.length > 0 && <CurrentHoldingCloseSummary holdingComponent={this} totals={totals} /> }
                { (this.state.open) && <CurrentHoldingOpenForm holdingComponent={this} holding={this.holding} /> }
                { (this.state.close) && <CurrentHoldingCloseForm holdingComponent={this} holding={this.holding} /> }
                { /* <span>Sub Total: {totals.buyValue}</span> */ }
            </div>
        )
    }
})