minimatch = require("minimatch")

module.exports = (f, stat) => {

    // ignores
    if ( minimatch(f, "**/typeDefs") ) return false


    //matches
    //if ( stat.isFile() && minimatch(f, "{src,tests}/**/*") ) return true
    //console.log(f, minimatch(f, "{src,tests}"))
    //console.log(f, minimatch(f, "{src,tests}/**/*"))
    //if ( minimatch(f, "{src,tests}/**/*") ) return true

    if ( minimatch(f, "{src,tests}") ) return true
    if ( minimatch(f, "{src,tests}/**/*") ) return true

    return false
}