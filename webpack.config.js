const path = require("path");
const webpack = require("webpack");
const {merge} = require("webpack-merge");
const {VueLoaderPlugin} = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const devConfig = require("./webpack-config/webpack.dev.config");
const buildConfig = require("./webpack-config/webpack.build.config");

module.exports = (env, option) => {
    const baseConfig = {
        mode : option.mode,
        entry : {
            blog : ["@babel/polyfill", "./public_dev/src/index.js"]
        },
        output : {
            filename : "src/[name].js",
            path : path.resolve(__dirname + "/public"),
        },
        module : {
            rules : [
                {
                    test : /\.vue$/,
                    loader : "vue-loader"
                },
                {
                    test : /\.js$/,
                    exclude : /node_modules/,
                    loader : "babel-loader",
                },
                {
                    test : /\.(scss|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                        "sass-loader"
                    ]
                },
                {
                    test : /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                    loader : "file-loader",
                    options: {
                        name : "[name].[ext]",
                        outputPath : "src/images",
                        publicPath : (url, resourcePath, context) => {
                            return `../images/${url}`;
                        }
                    }
                },
                {
                    test : /\.(woff2?)?$/,
                    loader : "file-loader",
                    options: {
                        name : "[name].[ext]",
                        outputPath : "src/fonts",
                        publicPath : (url, resourcePath, context) => {
                            return `../fonts/${url}`;
                        }
                    }
                },
            ]
        },
        plugins : [
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: "src/style/[name].css"
            }),
            new CopyWebpackPlugin([
                {
                    from : "./public_dev/manifest.json",
                    to : "./manifest.json"
                }
            ]),
            new webpack.DefinePlugin({
                "process.env" : {
                    MODE : `'${option.mode}'`
                }
            }),
        ],
        resolve : {
            alias : {
                "vue$": "vue/dist/vue.esm.js",
                "@" : path.join(__dirname, "public_dev/src/vue"),
                "src" : path.join(__dirname, "public_dev/src")
            },
            extensions : ["*", ".js", ".vue", ".json"]
        }
    };
    if(option.mode === "production"){
        return merge(baseConfig, buildConfig());
    }else{
        return merge(baseConfig, devConfig());
    };
};