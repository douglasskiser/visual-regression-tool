var Script = require('./script.model');

module.exports = function(app) {
    return {
        get: function(req) {
            Script.find(function(err, scripts) {
                if (err) {
                    //handle err
                }
                return req.io.emit('data:scripts', scripts);
            });
        } 
    };
};