var db = require('../db'),
    Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    Model = require('../models/job');

var Collection = Super.extend({
    model: Model
});

Collection.prototype.handleExtraColumns = function(qb, extraColumns, extraOrderColumns) {

    var columns = _.union(extraColumns, _.keys(extraOrderColumns));

    if (_.contains(columns, 'type')) {
        qb.join('JobType', 'JobType.id', '=', 'Job.typeId');
        if (extraOrderColumns.type) {
            qb.orderBy('JobType.name', extraOrderColumns.type);
        }
    }
};


module.exports = Collection;
