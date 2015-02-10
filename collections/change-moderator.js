var db = require('../db'),
    Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    Model = require('../models/change-moderator');

var Collection = Super.extend({
    model: Model
});

// Collection.prototype.handleExtraColumns = function(qb, extraColumns, extraOrderColumns) {
//     var columns = _.union(extraColumns, _.keys(extraOrderColumns));
// };


module.exports = Collection;
