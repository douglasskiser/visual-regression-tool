define(function(require) {
    var _ = require('underscore'),
        Super = require('./base'),
        Model = require('../models/health-check');

    var Collection = Super.extend({
        model: Model
    });


    return Collection;
});