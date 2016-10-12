
// ========================================
// Application configuration
// ========================================


var config = {
    // General options
    server : {
        defaultPort: 8000,
        staticPath : "public"
    },

    // Database options
    db : {
        url : "mongodb://busstat-dbuser:petuh@ds035026.mlab.com:35026/busstat-db"
    },

    // Tokens and authentication
    token: {
        secret: "petooh",
        options : { session: false},
        life : {
            amount : 7,
            unit : 'days'
        }
    }
};


module.exports = config;
