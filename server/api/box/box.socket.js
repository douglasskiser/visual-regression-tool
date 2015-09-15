var Box = require('./box.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        read: function(req) {
            console.log(req);
            Box.find(function(err, boxes) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:boxes', boxes);
            });
        },
        read: function(req) {
            Box.findById(req.data._id, function(err, box) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:box', box);
            });
        },
        create: function(req, data) {
            Box.create(data, function(err, box) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:boxes:created', box);
            });
        },
        update: function(req, data) {
            Box.findById(data.id, function(err, box) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(box, data);
                
                box.save(function(err, updatedBox) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:boxes:updated', updatedBox);
                });
            });
        },
        delete: function(req, data) {
            Box.findByIdAndRemove(data.id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:boxes:deleted', data._id);
            });
        }
    };
};