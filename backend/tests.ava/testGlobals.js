
global.test = it

global.requestError = (e) => {
    console.log(e.response)
    console.log(e.request)
    console.log(e.stack)
}