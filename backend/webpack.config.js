module.exports = {
    entry: "./server.js",
    output: {
      path: __dirname,
      filename: "static/bundle.js"
    },
    resolve: {
      extensions: [".js", ".marko"]
    },
    module: {
      rules: [
        {
          test: /\.marko$/,
          loader: "@marko/webpack/loader"
        }
      ]
    }
  };