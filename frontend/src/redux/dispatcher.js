
export default function(dispatch) {
    
    return {
        updateStore: (... args) => {

            if (args.length === 1) {

                //let type = 'update'
                const payload = args[0]

                const d = dispatch({
                    type: 'update',
                    payload
                })

                return
            }

            if (args.length === 2) {

                const type = args[0]
                const payload = args[1]

                const d = dispatch({
                    type,
                    payload
                })
                
                return
            }

            console.log(`updateStore redux dispatcher called with invalid number of arguments: ${ args.length}`)

        }
    }

}