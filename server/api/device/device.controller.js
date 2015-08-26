var Device = require('./device.model'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    Device.find(function(err, devices) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(devices);
    });
};