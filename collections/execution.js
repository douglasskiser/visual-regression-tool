var db = require('../db'),
    Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    Model = require('../models/execution');

var Collection = Super.extend({
    model: Model
});

Collection.prototype.handleExtraColumns = function(qb, extraColumns, extraOrderColumns) {

    var columns = _.union(extraColumns, _.keys(extraOrderColumns));

    if (_.contains(columns, 'type')) {
        qb.join('ExecutionType', 'ExecutionType.id', '=', 'Execution.typeId');
        if (extraOrderColumns.type) {
            qb.orderBy('ExecutionType.name', extraOrderColumns.type);
        }
    }

    if (_.contains(columns, 'status')) {
        qb.join('ExecutionStatus', 'ExecutionStatus.id', '=', 'Execution.statusId');
        if (extraOrderColumns.status) {
            qb.orderBy('ExecutionStatus.name', extraOrderColumns.status);
        }
    }
};



module.exports = Collection;
