define(function(require) {
    var Super = require('./base');

    var Model = Super.extend({
        // urlRoot: '/rest/model/user'
        name: 'user'
    });
    
    Model.prototype.isLoggedIn = function() {
        return !this.isNew();
    };

    return Model;
});