
export const objToGraphqlInner = (obj = {}) => {
    let output = '{\n'
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string')
            output += `        ${k}: "${v}"\n`
        else
            output += `        ${k}: ${v}\n`
    }
    output += '    }'

    return output
}

export const objToGraphq = (obj = {}) => {
    let output = ""
    for (let [k, v] of Object.entries(obj)) {
        switch (typeof v) {
            case 'object':
                v = objToGraphqlInner(v)
                output += `        ${k}: ${v}\n`
                break
            case 'string':
                output += `        ${k}: "${v}"\n`
                break
            default:
                output += `        ${k}: ${v}\n`
                break
        }
    }

    return output
}

export const formatInputData = (input) => {
    if ( typeof input === 'object' ) {
        // turn the js obj into graphql structure
        input = objToGraphq(input)
    }
    return input
}

export const formatInnerInputData = (input) => {
    if ( typeof input === 'object' ) {
        // turn the js obj into graphql structure
        input = objToGraphqlInner(input)
    }
    return input
}

export const formatSingleInputData = (input) => {
    if ( typeof input === 'string' ) {
        // turn the js obj into graphql structure
        input = `"${input}"`
    }
    return input
}