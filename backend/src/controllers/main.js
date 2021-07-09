
export const index = (req, res) => {

    res.sendFile('frontend/build/index.html', {root: __dirname })
    
}