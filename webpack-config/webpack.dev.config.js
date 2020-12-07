const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

function injectResource(html){
    let h = html.toString();
    // h = h.replace("</head>", `<link href="/src/style/blog.css" rel="stylesheet"></head>`);
    // h = h.replace("</body>", `<script src="/src/blog.js"></script></body>`);
    return h;
};

module.exports = () => ({
    plugins : [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer : {
        port : 8080,
        compress : true,
        index : "index.html",
        contentBase : path.join(__dirname, "/public"),
        disableHostCheck : true,
        before(app, server){
            app.get(/^(\/$|\/skydown|\/time-line|\/front-end|\/back-end|\/develop|\/write$\/modify\/\d+$|\/login$|\/search)/, (req, res) => {
                fs.readFile(path.join(__dirname, "../public_dev/index.html"), "utf8", (err, data) => {
                    res.send(injectResource(data));
                });
            });
        },
        proxy : [
            {
                context : ["/api", "/loginCheck", "/upload", "/temp"],
                target : "http://localhost",
                changeOrigin : true,
            }
        ],
    }
});
