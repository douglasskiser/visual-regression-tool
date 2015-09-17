var Device = require('./device.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
               Device.findById(req.data._id, function(err, device) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:device:read', device);
                }); 
            } else {
                Device.find(function(err, devices) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:device:read', devices);
                });
            }
        },
        create: function(req) {
            Device.create(req.data, function(err, device) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:device:create', device);
            });
        },
        update: function(req) {
            Device.findById(req.data._id, function(err, device) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(device, req.data);
                
                device.save(function(err, updatedDevice) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:device:update', updatedDevice);
                });
            });
        },
        delete: function(req) {
            Device.findByIdAndRemove(req.data._id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:device:delete', req.data._id);
            });
        }
    };
};