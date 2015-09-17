var Box = require('./box.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
                Box.findById(req.data._id, function(err, box) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:box:read', box);
                });
            } else {
                Box.find(function(err, boxes) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:box:read', boxes);
                });
            }
        },
        create: function(req) {
            Box.create(req.data, function(err, box) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:box:create', box);
            });
        },
        update: function(req) {
            Box.findById(req.data._id, function(err, box) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(box, req.data);
                
                box.save(function(err, updatedBox) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:box:update', updatedBox);
                });
            });
        },
        delete: function(req) {
            Box.findByIdAndRemove(req.data._id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:box:delete', req.data._id);
            });
        }
    };
};