

try {
    const resolvedPath1 = require.resolve('./babel.config.js', 'C:\\Users\\Robert\\Google Drive\\WebDocs\\stocks-tracker-preact-modules\\backend')
    console.log('resolvedPath1', resolvedPath1)
} catch (e) {
    console.log(e)
}

try {
    const resolvedPath2 = require.resolve('./babel.config.json', 'C:/Users/Robert/Google Drive/WebDocs/stocks-tracker-preact-modules/backend')
    console.log('resolvedPath2', resolvedPath2)
} catch (e) {
    console.log(e)
}

try {
    const eslint = require.resolve('eslint', 'C:/Users/Robert/Google Drive/WebDocs/stocks-tracker-preact-modules/backend/node_modules')
    console.log('eslint', eslint)
} catch (e) {
    console.log(e)
}