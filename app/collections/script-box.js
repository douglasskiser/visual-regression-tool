define(function(require) {
    var Super = require('./base'),
        Model = require('../models/script-box');

    var Collection = Super.extend({
        model: Model,
        url: 'rest/collection/script-box'
    });

    return Collection;
});