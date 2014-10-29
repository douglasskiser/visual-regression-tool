var db = require('../db'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    Checkit = require('checkit'),
    Collection = require('../collections/script-box'),
    Model = require('../models/script-box'),
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