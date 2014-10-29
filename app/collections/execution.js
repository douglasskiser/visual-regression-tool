define(function(require) {
    var _ = require('underscore'),
        Super = require('./base'),
        Model = require('../models/execution');

    var Collection = Super.extend({
        model: Model,
        url: 'rest/collection/execution'
        // ,
        // comparator: function(model) {
        //     return parseInt(model.id, 10);
        // }
    });


    return Collection;
});