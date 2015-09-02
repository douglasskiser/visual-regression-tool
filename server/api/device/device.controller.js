var Device = require('./device.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    Device.find(function(err, devices) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(devices);
    });
};

exports.getOne = function(req, res) {
    Device.findOne({id: req.params.id}, function(err, device) { //Device.findById(req.params.id, function(err, device) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(device);
    });
};

exports.create = function(req, res) {
    Device.create(req.body, function(err, device) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(device);
    });
};

exports.update = function(req, res) {
    Device.findById(req.params.id, function(err, device) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        _.extend(device, req.body);
        
        device.save(function(err, updatedDevice) {
            if (err) {
                return errors.handleResponseError(res, 500, err);
            }
            return res.json(updatedDevice);
        });
    });
};

exports.delete = function(req, res) {
    Device.findByIdAndRemove(req.params.id, function(err, device) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.send(204);
    });
};