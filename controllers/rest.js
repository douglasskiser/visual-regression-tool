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

    return Collection.forge()
        .query(function(qb) {
            if (req.query.distinct) {
                if (!_.isEmpty(req.query.columns) && _.isArray(req.query.columns)) {
                    qb.distinct(req.query.columns);
                }
            }
            else {
                if (!_.isEmpty(req.query.columns) && _.isArray(req.query.columns)) {
                    qb.column(req.query.columns);
                }
            }

            if (!_.isEmpty(req.query.selection) && _.isArray(req.query.selection)) {
                var allowedOperands = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 's', 'ls', 'rs', 'in', 'nin', 'between', 'nbetween', 'null', 'nnull'];
                _.forEach(req.query.selection, function(clause) {
                    var field = clause.field,
                        operand = clause.operand || 'eq',
                        value = clause.value;
                    if (_.isEmpty(field)) {
                        return false;
                    }

                    switch (operand) {
                        case 'in':
                            if (!_.isEmpty(value) && _.isArray(value)) {
                                qb.whereIn(field, value);
                            }
                            break;
                        case 'nin':
                            if (!_.isEmpty(value) && _.isArray(value)) {
                                qb.whereNotIn(field, value);
                            }
                            break;
                        case 'between':
                            if (!_.isEmpty(value) && _.isArray(value) && value.length === 2) {
                                qb.whereBetween(field, value);
                            }
                            break;
                        case 'nbetween':
                            if (!_.isEmpty(value) && _.isArray(value) && value.length === 2) {
                                qb.whereNotBetween(field, value);
                            }
                            break;
                        case 'null':
                            qb.whereNull(field);
                            break;
                        case 'nnull':
                            qb.whereNotNull(field);
                            break;
                        case 's':
                            if (!_.isEmpty(value) && _.isString(value)) {
                                qb.where(field, 'like', '%' + value + '%');
                            }
                            break;
                        case 'ls':
                            if (!_.isEmpty(value) && _.isString(value)) {
                                qb.where(field, 'like', '%' + value);
                            }
                            break;
                        case 'rs':
                            if (!_.isEmpty(value) && _.isString(value)) {
                                qb.where(field, 'like', value + '%');
                            }
                            break;
                        case 'eq':
                            if (!_.isEmpty(value)) {
                                qb.where(field, '=', value);
                            }
                            break;
                        case 'neq':
                            if (!_.isEmpty(value)) {
                                qb.where(field, '<>', value);
                            }
                            break;
                        case 'gt':
                            if (!_.isEmpty(value) && _.isNumber(value)) {
                                qb.where(field, '>', value);
                            }
                            break;
                        case 'gte':
                            if (!_.isEmpty(value) && _.isNumber(value)) {
                                qb.where(field, '>=', value);
                            }
                            break;
                        case 'lt':
                            if (!_.isEmpty(value) && _.isNumber(value)) {
                                qb.where(field, '<', value);
                            }
                            break;
                        case 'lte':
                            if (!_.isEmpty(value) && _.isNumber(value)) {
                                qb.where(field, '<=', value);
                            }
                            break;
                    }
                });
            }

            if (!_.isEmpty(req.query.limit) && _.isNumber(req.query.limit)) {
                var limit = parseInt(req.query.limit);
                if (!isNaN(limit) && limit >= 0) {
                    qb.limit(limit);
                }
            }

            if (!_.isEmpty(req.query.offset) && _.isNumber(req.query.offset)) {
                var offset = parseInt(req.query.offset);
                if (!isNaN(offset) && offset >= 0) {
                    qb.offset(offset);
                }
            }

            if (!_.isEmpty(req.query.groupBy) && _.isArray(req.query.groupBy)) {
                qb.groupBy(req.query.groupBy);
            }


            //TODO: having support


            if (!_.isEmpty(req.query.orderBy) && _.isObject(req.query.orderBy)) {
                _.forEach(req.query.orderBy, function(d, field) {
                    var direction = d === 'asc' ? 'asc' : 'desc';

                    if (_.isEmpty(field)) {
                        return false;
                    }
                    qb.orderBy(field, direction);
                });
            }
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
