define(function(require) {
    var Super = require('./base');

    var Model = Super.extend({
        name: 'job-type'
    });
    Model.ID_VISUAL_REGRESSION = 1;
    Model.ID_CHANGES_MODERATOR = 2;

    return Model;
});