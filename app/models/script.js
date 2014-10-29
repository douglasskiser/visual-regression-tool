define(function(require) {
    var Super = require('./base');

    var Model = Super.extend({
        urlRoot: '/rest/model/script'
    });
    

    return Model;
});