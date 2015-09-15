var Script = require('./script.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Script.find(function(err, scripts) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:scripts', scripts);
            });
        },
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
                Script.findById(req.data._id, function(err, script) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:script', script);
                });
            } else {
                Script.find(function(err, script) {
                    if (err) {
                       return errors.handleSocketError(req, err); 
                    }
                    return req.io.emit('data:script', script);
                });
            }
        },
        create: function(req, data) {
            Script.create(data, function(err, script) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:scripts:created', script);
            });
        },
        update: function(req, data) {
            Script.findById(data.id, function(err, script) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(script, data);
                
                script.save(function(err, updatedScript) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:scripts:updated', updatedScript);
                });
            });
        },
        delete: function(req, data) {
            Script.findByIdAndRemove(data.id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:scripts:deleted', data._id);
            });
        }
    };
};