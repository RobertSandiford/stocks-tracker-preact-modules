
export default function(dispatch) {

    return {
        updateStore: (...args) => {

            if (args.length === 1) {

                //let type = 'update'
                let payload = args[0]

                let d = dispatch({ 
                    type: 'update', 
                    payload : payload
                })

                return
            }

            if (args.length === 2) {

                let type = args[0]
                let payload = args[1]

                let d = dispatch({ 
                    type: type, 
                    payload : payload
                })
                
                return
            }

            console.log("updateStore redux dispatcher called with invalid number of arguments: " + args.length)

        }
    }

}