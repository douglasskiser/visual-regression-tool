var db = require('../db'),
    Model = require('../models/base'),
    _ = require('underscore'),
    _s = require('underscore.string');

var Collection = db.Collection.extend({
    model: Model
});

Collection.prototype.export = function(viewerId) {
    return this.map(function(model){
        return model.export(viewerId);
    });
};


module.exports = Collection;
