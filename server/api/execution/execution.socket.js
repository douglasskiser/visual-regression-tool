var Execution = require('./execution.model'),
    ExecutionStatus = require('../execution-status/execution-status.model'),
    Job = require('../job/job.model'),
    executionCtrl = require('./execution.controller'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors'),
    mongoose = require('mongoose');

module.exports = function(app, agenda) {
    return {
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
                Execution.findById(req.data._id, function(err, exc) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:execution:read', exc);
                });
            } else {
                Execution.find(function(err, exc) {
                    if (err) {
                        return errors.handleResponseError(req, err);
                    } 
                    
                    return req.io.emit('data:execution:read', exc);
                });
            }
        },
        create: function(req) {
            var statuses = [
                'Scheduled',
                'Running',
                'Completed',
                'Error',
                'Terminated'
            ];
            
            ExecutionStatus.findOne({name: statuses[req.data.statusId + 1]}, function(err, status) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                
                
                req.data.statusId = status._id;
                
                Job.findById(req.data.jobId, function(err, job) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    
                    req.data.jobId = job._id;

                    var exc = new Execution(req.data);
                    
                    exc.save(function(err, newExc) {
                        if (err) {
                            return errors.handleSocketError(req, err);
                        }
                        
                        agenda.create({_id: newExc._id});
                        
                        req.io.emit('data:execution:create', newExc);
                        app.io.broadcast('data:execution:create', newExc);
                    });
                });
                
                
            });
        },
        update: function(req) {
            Execution.findById(req.data._id, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(exc, req.data);
                
                exc.save(function(err, updatedExecution) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    req.io.emit('data:execution:update', updatedExecution);
                    app.io.broadcast('data:execution:update', updatedExecution);
                });
            });
        },
        patch: function(req) {
            Execution.findById(req.data._id, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(exc, req.data);
                
                exc.save(function(err, updatedExecution) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    
                    agenda.create({_id: updatedExecution._id});
                    
                    req.io.emit('data:execution:patch', updatedExecution);
                    app.io.broadcast('data:execution:patch', updatedExecution);
                });
            });
        },
        delete: function(req) {
            Execution.findByIdAndRemove(req.data._id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                
                req.io.emit('data:execution:delete', {_id: req.data._id});
                app.io.broadcast('data:execution:delete', {_id: req.data._id});
            });  
        },
        run: function(req) {
            Execution.findById(req.data._id, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                // add to agenda
                agenda.create({_id: req.data._id});
                
                // tell them its in the agenda
                return req.io.emit('data:execution:run', exc);
            });
        },
        screenshots: function(req) {
            Execution.findById(req.data._id, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                
                var ss = executionCtrl.methods.getScreenshots(exc);
                
                return req.io.respond('data:execution:screenshots', {_id: req.data._id, oldScreenshots: ss.oldScreenshots, newScreenshots: ss.newScreenshots});
            });
        }
    };
};