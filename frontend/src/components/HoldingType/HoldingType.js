
import { h, Component } from 'preact'

class HoldingType extends Component {
    constructor(props) {
        super(props)

        this.state = {
            type : 'stock'
        }
        this.form = {
            ticker : ''
        }
    }

    radioChanged(event) {
        console.log("radio")
        console.log(event.target.name)
        console.log(event.target.value)
    }
    typeClick(event) {
    }
    typeFocus(event) {
    }
    typeChanged(event) {
    }

    render() {
        return (
            <div>
                <div>
                    <input type="radio" id="asset-typee" name="asset-type" value="stock" onChange={this.radioChanged} />
                    <span>Stock Ticker: </span>
                    <input id="ticker" name="ticker" key="ticker" placeholder="e.g. TSLA"
                        defaultValue={this.form.ticker} data-type="stock" onChange={this.typeChanged} />
                </div>

                <div>
                    <input type="radio" name="asset-type" value="crypto" onChange={this.radioChanged} />
                    <span>Crypto Symbol: </span>
                    <input id="ticker" name="ticker" key="ticker" placeholder="e.g. BTC"
                        defaultValue={this.form.ticker} data-type="crypto" onChange={this.typeChanged} />
                </div>

                <div>
                    <input type="radio" name="asset-type" value="currency" onChange={this.radioChanged} />
                    <span>Currency Symbol: </span>
                    <input id="ticker" name="ticker" key="ticker" placeholder="e.g. USD"
                        defaultValue={this.form.ticker} data-type="currency" onChange={this.inputChanged} />
                </div>

                <div>
                    <input type="radio" name="asset-type" value="fund" onChange={this.radioChanged} />
                    <span>Fund ISIN: </span>
                    <input id="ticker" name="ticker" key="ticker" placeholder="e.g. US0004026250"
                        defaultValue={this.form.ticker} data-type="fund" onChange={this.inputChanged} />
                </div>

                <div>
                    <input type="radio" name="asset-type" value="custom" onChange={this.radioChanged} />
                    <span>Custom - Tag (optional): </span>
                    <input id="ticker" name="ticker" key="ticker" placeholder="e.g. Anything"
                        defaultValue={this.form.ticker} data-type="custom" onChange={this.inputChanged} />
                </div>
            </div>
        )
    }
}