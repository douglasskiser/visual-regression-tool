var Script = require('./script.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
                Script.findById(req.data._id, function(err, script) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:script:read', script);
                });
            } else {
                Script.find(function(err, script) {
                    if (err) {
                       return errors.handleSocketError(req, err); 
                    }
                    return req.io.emit('data:script:read', script);
                });
            }
        },
        create: function(req) {
            Script.create(req.data, function(err, script) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:script:create', script);
            });
        },
        update: function(req) {
            Script.findById(req.data._id, function(err, script) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(script, req.data);
                
                script.save(function(err, updatedScript) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:script:update', updatedScript);
                });
            });
        },
        delete: function(req) {
            Script.findByIdAndRemove(req.data._id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:script:delete', req.data._id);
            });
        }
    };
};