const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (dateHash) => ({
    plugins : [
        new HtmlWebpackPlugin({
            template : "./public_dev/index.html",
            filename : "index.html",
            minify : true,
            inject : false
        })
    ]
});
