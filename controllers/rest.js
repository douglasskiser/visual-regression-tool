var db = require('../db'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    Checkit = require('checkit'),
    Model = require('../models/execution'),
    logger = require('../logger'),
    _ = require('underscore'),
    utils = require('../utils'),
    _s = require('underscore.string');


exports.fetchMany = function(req, res, next) {
    var Collection,
        name = req.params.name;
    try {
        Collection = require('../collections/' + _s.dasherize(name));
    }
    catch (e) {
        logger.warn('Client requested undefined collection!');
        // utils.sendError(e, req, res, next);
        res.send(404);
    }
    return Collection.forge().fetchMany(req.query)
        .then(function(docs) {
            res.send(docs.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};


exports.create = function(req, res, next) {
    var Model,
        name = req.params.name;
    try {
        Model = require('../models/' + _s.dasherize(name));
    }
    catch (e) {
        logger.warn('Client requested undefined model!');
        // utils.sendError(e, req, res, next);
        res.send(404);
    }

    return Model.forge(req.body)
        .save()
        .then(function(doc) {
            res.send(doc.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};





exports.fetchOne = function(req, res, next) {
    var Model,
        name = req.params.name;
    try {
        Model = require('../models/' + _s.dasherize(name));
    }
    catch (e) {
        logger.warn('Client requested undefined model!');
        // utils.sendError(e, req, res, next);
        res.send(404);
        return;
    }

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


exports.update = function(req, res, next) {
    var Model,
        name = req.params.name;
    try {
        Model = require('../models/' + _s.dasherize(name));
    }
    catch (e) {
        logger.warn('Client requested undefined model!');
        // utils.sendError(e, req, res, next);
        res.send(404);
    }
    Model.forge({
            id: req.params.id
        })
        .fetch({
            require: true
        })
        .then(function(doc) {
            // console.log(_.pick(req.body, _.without(_.keys(doc.toJSON()), 'id')));
            // console.log(_.without(_.keys(doc.toJSON()), 'id'));
            
            return doc.save(_.pick(req.body, _.without(_.keys(doc.toJSON()), 'id')), {
                patch: true,
                user: req.user
            });
        })
        .then(function(doc) {
            res.send(doc.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};


exports.delete = function(req, res, next) {
    var Model,
        name = req.params.name;
    try {
        Model = require('../models/' + _s.dasherize(name));
    }
    catch (e) {
        logger.warn('Client requested undefined model!');
        // utils.sendError(e, req, res, next);
        res.send(404);
    }
    Model.forge({
            id: req.params.id
        })
        .fetch({
            require: true
        })
        .then(function(doc) {
            return doc.destroy({
                user: req.user
            });
        })
        .then(function(doc) {
            res.send(doc.export(req.user));
        })
        .catch(function(e) {
            utils.sendError(e, req, res, next);
        });
};


// exports.screenshots = function(req, res, next) {
//     Model.forge({
//             id: req.params.id
//         })
//         .fetch()
//         .then(function(model) {
//             return model.getScreenshots();
//         })
//         .then(function(results) {
//             res.send(results);
//         })
//         .catch(function(e) {
//             utils.sendError(e, req, res, next);
//         });
// };


// exports.delete = function(req, res, next) {
//     Model.forge({
//             id: req.params.id
//         })
//         .fetch()
//         .then(function(model) {
//             return model.destroy();
//         })
//         .then(function() {
//             res.send({
//                 count: 1
//             });
//         })
//         .catch(function(e) {
//             utils.sendError(e, req, res, next);
//         });
// };
