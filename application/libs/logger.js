
// ========================================
// Logging module
// ========================================

var winston = require('winston');

function getLogger(module) {
    // Name of file which prints in log
    var path = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение

    // Create logger
    return new winston.Logger({
        // Transports for logs
        transports : [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path
            })
        ]
    });
}

module.exports = getLogger;