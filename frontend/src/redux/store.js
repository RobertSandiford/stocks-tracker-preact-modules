import { createStore, combineReducers } from "redux"
import rootReducer from "./reducers/rootReducer"


const initialState = {
    holdings : [],
    groups : []
}

let store

if (typeof window !== "undefined") { // Redux dev tools
    store = createStore(
        rootReducer,
        initialState,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
} else { // Do not include Redux dev tools when building
    store = createStore(
        rootReducer,
        initialState
    )
}

export default store
