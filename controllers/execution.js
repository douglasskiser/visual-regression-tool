var db = require('../db'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    Checkit = require('checkit'),
    Collection = require('../collections/execution'),
    Model = require('../models/execution'),
    logger = require('../logger'),
    _ = require('underscore'),
    utils = require('../utils'),
    _s = require('underscore.string');


exports.fetchMany = function(req, res, next) {
    return Collection.forge()
        .query(function(qb) {

            if (req.query.perPage) {
                qb.limit(req.query.perPage);
                if (req.query.page) {
                    qb.offset((req.query.page - 1) * (req.query.perPage))
                }
            }
            
            if( !_.isEmpty(req.query.oldBoxIds) ){
                qb.whereIn('oldBoxId', req.query.oldBoxIds.split(','));
            }
            if( !_.isEmpty(req.query.newBoxIds) ){
                qb.whereIn('newBoxId', req.query.newBoxIds.split(','));
            }
            if( !_.isEmpty(req.query.scriptIds) ){
                qb.whereIn('scriptId', req.query.scriptIds.split(','));
            }
            if( !_.isEmpty(req.query.deviceIds) ){
                qb.whereIn('deviceId', req.query.deviceIds.split(','));
            }
            if( !_.isEmpty(req.query.statuses)){
                qb.whereIn('status', req.query.statuses.split(','));
            }
            // qb.orderBy('updatedAt', 'asc');
        })
        .fetch()
        .then(function(docs) {
            res.send(docs.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};

exports.create = function(req, res, next) {

    Model.forge(_.pick(req.body, 'deviceId', 'newBoxId', 'oldBoxId', 'scriptId'))
        .save()
        .then(function(doc) {
            res.send(doc.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};

exports.run = function(req, res, next) {
    Model.forge({
            id: req.params.id
        })
        .fetch()
        .then(function(model) {
            return model.run();
        })
        .then(function(doc) {
            res.send(doc.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};


exports.fetchOne = function(req, res, next) {
    Model.forge({
            id: req.params.id
        })
        .fetch()
        .then(function(doc) {
            res.send(doc.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });

};


exports.screenshots = function(req, res, next) {
    Model.forge({
            id: req.params.id
        })
        .fetch()
        .then(function(model) {
            return model.getScreenshots();
        })
        .then(function(results) {
            res.send(results);
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};


exports.delete = function(req, res, next) {
    Model.forge({
            id: req.params.id
        })
        .fetch()
        .then(function(model) {
            return model.destroy();
        })
        .then(function() {
            res.send({
                count: 1
            });
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};
