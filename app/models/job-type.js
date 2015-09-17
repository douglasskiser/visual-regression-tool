define(function(require) {
    var Super = require('./base');

    var Model = Super.extend({
        name: 'job-type'
    });
    Model.ID_VISUAL_REGRESSION = '55f19f841309203f0300004c';//1;
    Model.ID_CHANGES_MODERATOR = '55f19f841309203f0300004d';//2;

    return Model;
});