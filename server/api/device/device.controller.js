var Device = require('./device.model');

exports.get = function(req, res) {
    Device.find(function(err, devices) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(devices);
    });
};