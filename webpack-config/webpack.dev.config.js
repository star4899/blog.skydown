const fs = require("fs");
const path = require("path");

function injectResource(html){
    let h = html.toString();
    // h = h.replace("</head>", `<link href="/src/style/blog.css" rel="stylesheet"></head>`);
    // h = h.replace("</body>", `<script src="/src/blog.js"></script></body>`);
    return h;
};

module.exports = () => ({
    devServer : {
        host : "127.0.0.1",
        port : 8080,
        compress : true,
        hot : true,
        allowedHosts : "all",
        static : {
            directory : path.join(__dirname, "../public")
        },
        setupMiddlewares(middlewares, devServer){
            devServer.app.get(/^\/(?!api)(([^\.]+)?(\/[^\.]+))?$/, (req, res) => {
                console.log(req.url);
                fs.readFile(path.join(__dirname, "../public_dev/index.html"), "utf8", (err, data) => {
                    if(err){
                        res.status(500).send(err.message);
                        return;
                    };
                    res.send(injectResource(data));
                });
            });
            return middlewares;
        },
        proxy : [
            {
                context : ["/api", "/loginCheck", "/upload", "/temp"],
                target : "http://localhost",
                changeOrigin : true
            }
        ]
    }
});
