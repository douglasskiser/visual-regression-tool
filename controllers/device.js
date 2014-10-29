var db = require('../db'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    Checkit = require('checkit'),
    Collection = require('../collections/device'),
    Model = require('../models/device'),
    logger = require('../logger'),
    _ = require('underscore'),
    utils = require('../utils'),
    _s = require('underscore.string');


exports.fetchMany = function(req, res, next) {
    Collection.forge()
        .query(function(qb) {
        })
        .fetch()
        .then(function(docs) {
            res.send(docs.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });

};

exports.fetchOne = function(req, res, next) {
    Model.forge({id: req.params.id})
        .fetch()
        .then(function(doc){
            res.send(doc.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });

};