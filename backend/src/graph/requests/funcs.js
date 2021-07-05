
module.exports.objToGraphqlInner = (obj = {}) => {
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


module.exports.objToGraphq = (obj = {}) => {
    let output = ""
    for (let [k, v] of Object.entries(obj)) {
        switch (typeof v) {
            case 'object':
                v = module.exports.objToGraphqlInner(v)
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

module.exports.formatInputData = (input) => {
    if ( typeof input === 'object' ) {
        // turn the js obj into graphql structure
        input = module.exports.objToGraphq(input)
    }
    return input
}

module.exports.formatInnerInputData = (input) => {
    if ( typeof input === 'object' ) {
        // turn the js obj into graphql structure
        input = module.exports.objToGraphqlInner(input)
    }
    return input
}

module.exports.formatSingleInputData = (input) => {
    if ( typeof input === 'string' ) {
        // turn the js obj into graphql structure
        input = `"${input}"`
    }
    return input
}