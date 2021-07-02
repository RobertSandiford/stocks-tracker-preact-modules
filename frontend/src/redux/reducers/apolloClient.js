
// Apollo Client Reducer

export default (state = {}, action) => {
    switch (action.type) {
        case "SaveApolloClient":
            return action.payload
        default:
            return state
    }
}