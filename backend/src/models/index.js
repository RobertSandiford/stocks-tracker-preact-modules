let files = require("fs").readdirSync(__dirname)
for (const [i, file] of files.entries()) {
    if (file == "index.js") continue // ignore this file
    let model = file.substring(0, file.lastIndexOf("."));
    module.exports[model] = require("./" + model)
}