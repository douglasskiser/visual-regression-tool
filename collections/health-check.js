var db = require('../db'),
    Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    Model = require('../models/health-check');

var Collection = Super.extend({
    model: Model
});
module.exports = Collection;
