const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = (dateHash) => ({
    plugins : [
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions : {
                discardComments : {
                    removeAll : true
                }
            }
        }),
        new HtmlWebpackPlugin({
            template : "./public_dev/index.html",
            filename : "index.html",
            minify : true,
            inject : false
        })
    ]
});
