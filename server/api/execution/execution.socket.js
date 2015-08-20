var Execution = require('./execution.model');

module.exports = function(app) {
    return {
        get: function(req) {
            Execution.find(function(err, excs) {
                if (err) {
                    //handle err
                }
                return req.io.emit('data:executions', excs);
            });
        } 
    };
};