var Device = require('./device.model'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Device.find(function(err, devices) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:devices', devices);
            });
        } 
    };
};