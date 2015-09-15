var Device = require('./device.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Device.find(function(err, devices) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:device', devices);
            });
        },
        read: function(req) {
            Device.findById(req.data._id, function(err, device) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:device', device);
            });
        },
        create: function(req, data) {
            Device.create(data, function(err, device) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:devices:created', device);
            });
        },
        update: function(req, data) {
            Device.findById(data.id, function(err, device) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(device, data);
                
                device.save(function(err, updatedDevice) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:devices:updated', updatedDevice);
                });
            });
        },
        delete: function(req, data) {
            Device.findByIdAndRemove(data.id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:devices:deleted', data._id);
            });
        }
    };
};