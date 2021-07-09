
import { h, Component } from 'preact'

export default class HoldingsSorter extends Component {
    constructor(props) {
        super(props)

        this.sortChanged = (num, event) => {
            const s = event.target.value

            const sort = this.props.currentHoldingsComponent.state.sort
            sort[num] = s

            this.props.currentHoldingsComponent.setState({ sort })
        }
    }
    render() {
        const sorts = this.props.currentHoldingsComponent.state.sort
        return (
            <div>
                <div id="sorts">
                    Sort: <select onChange={event => { this.sortChanged(1, event) }} defaultValue={sorts[1]}>
                        <option value=""></option>
                        <option value="name">Title</option>
                        <option value="ticker">Symbol</option>
                        <option value="type">Type</option>
                        <option value="group">Group</option>
                        <option value="region">Region</option>
                        <option value="buyDate">Buy Date</option>
                        <option value="timeHeld">Time Held</option>
                        <option value="percentageChange">% Change</option>
                        <option value="percentageChangeAnnum">% / Year</option>
                    </select>
                    <select onChange={event => { this.sortChanged(2, event) }} defaultValue={sorts[2]}>
                        <option value=""></option>
                        <option value="name">Title</option>
                        <option value="ticker">Symbol</option>
                        <option value="type">Type</option>
                        <option value="group">Group</option>
                        <option value="region">Region</option>
                        <option value="buyDate">Buy Date</option>
                        <option value="timeHeld">Time Held</option>
                        <option value="percentageChange">% Change</option>
                        <option value="percentageChangeAnnum">% / Year</option>
                    </select>
                    <select onChange={event => { this.sortChanged(3, event) }} defaultValue={sorts[3]}>
                        <option value=""></option>
                        <option value="name">Title</option>
                        <option value="ticker">Symbol</option>
                        <option value="type">Type</option>
                        <option value="group">Group</option>
                        <option value="region">Region</option>
                        <option value="buyDate">Buy Date</option>
                        <option value="timeHeld">Time Held</option>
                        <option value="percentageChange">% Change</option>
                        <option value="percentageChangeAnnum">% / Year</option>
                    </select>
                </div>
                <div id="groupings">
                    <input type="checkbox" checked title="Groups items with the same type, symbol and group" /> Group matching items
                </div>
                <br /><br />
            </div>
        )
    }
}