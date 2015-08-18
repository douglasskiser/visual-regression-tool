var Device = require('./device.model');

module.exports = function(app) {
    return {
        get: function(req) {
            Device.find(function(err, devices) {
                if (err) {
                    //handle err
                }
                return req.io.emit('data:devices', devices);
            });
        } 
    };
};