var Execution = require('./execution.model'),
    executionCtrl = require('./execution.controller'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Execution.find(function(err, excs) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:executions', excs);
            });
        },
        create: function(req, data) {
            Execution.create(data, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:executions:created', exc);
            });
        },
        update: function(req, data) {
            Execution.findById(data.id, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(exc, data);
                
                exc.save(function(err, updatedExecution) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:scripts:updated', updatedExecution);
                });
            });
        },
        delete: function(req, data) {
            Execution.findByIdAndRemove(data.id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                
                return req.io.emit('data:executions:deleted');
            });  
        },
        run: function(req, data) {
            Execution.findById(data.id, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                executionCtrl.methods.run(exc);
                return req.io.emit('data:executions:running', exc);
            }); 
        },
        screenshots: function(req, data) {
            Execution.findById(data.id, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                
                var ss = executionCtrl.methods.getScreenshots(exc);
                
                return req.io.emit('data:executions:screenshot', ss);
            });
        }
    };
};