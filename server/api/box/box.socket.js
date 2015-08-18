var Box = require('./box.model');

module.exports = function(app) {
    return {
        get: function(req) {
            Box.find(function(err, boxes) {
                if (err) {
                    //handle err
                }
                return req.io.emit('data:boxes', boxes);
            });
        } 
    };
};