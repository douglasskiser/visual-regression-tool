var User = require('./user.model');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var async = require('async');
var crypto = require('crypto');

var validationError = function(res, err) {
    return res.json(422, err);
};

exports.get = function(req, res) {
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if (err) {
            return res.send(500, err);
        }
        res.send(200, users);
    });
};

exports.getOne = function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.json(user.profile);
    });
};

exports.create = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'admin';
    newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        res.json(user);
    });
};

exports.delete = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if (err) return res.send(500, err);
        return res.send(204);
    });
};

exports.update = function(req, res, next) {
    var userId = req.user._id;
    var name = String(req.body.name);
    var email = String(req.body.email);

    User.findById(userId, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        user.name = name;
        user.email = email;
        user.save(function(err) {
            if (err) return next(err);
            res.send(200, user);
        })
    });
};

exports.me = function(req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};

exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

exports.logout = function(req, res) {
    req.logOut();
    res.send(200);
};