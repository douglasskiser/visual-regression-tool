define(function(require) {
    var _ = require('underscore'),
        Super = require('./base'),
        Model = require('../models/execution');

    var Collection = Super.extend({
        model: Model,
        url: 'rest/collection/execution'
    });


    return Collection;
});