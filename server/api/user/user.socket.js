var User = require('./user.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors'),
    mongoose = require('mongoose');

module.exports = function(app) {
    return {
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
                User.findById(req.data._id, function(err, user) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:user:read', user);
                });
            } else {
                User.find(function(err, user) {
                    if (err) {
                        return errors.handleResponseError(req, err);
                    } 
                    
                    return req.io.emit('data:user:read', user);
                });
            }
        },
        create: function(req) {
            console.log('creating a new user with : ', req.data)
            
            var user = new User(req.data);
            
            user.save(function(err, newUser) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                req.io.emit('data:user:create', newUser);
            });
        },
        update: function(req) {
            User.findById(req.data._id, function(err, exc) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(exc, req.data);
                
                exc.save(function(err, updatedUser) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    req.io.emit('data:user:update', updatedUser);
                    app.io.broadcast('data:user:update', updatedUser);
                });
            });
        },
        delete: function(req) {
            User.findByIdAndRemove(req.data._id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                
                req.io.emit('data:user:delete', {_id: req.data._id});
                app.io.broadcast('data:user:delete', {_id: req.data._id});
            });  
        }
    };
};