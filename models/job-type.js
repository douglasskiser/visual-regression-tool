var Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    logger = require('../logger'),

    Model = Super.extend({
        tableName: 'JobType'
    });

    Model.ID_VISUAL_REGRESSION = 1;
    Model.ID_HEALTH_CHECK = 2;
    
module.exports = Model;
