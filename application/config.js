
var config = {
    server : {
        defaultPort: 8000,
        staticPath : "public"
    },

    db : {
        url : "mongodb://busstat-dbuser:petuh@ds035026.mlab.com:35026/busstat-db"
    },

    token: {
        secret: "petooh"
    }
};


module.exports = config;
