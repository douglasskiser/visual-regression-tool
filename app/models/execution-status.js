define(function(require) {
    var Super = require('./base');

    var Model = Super.extend({
        name: 'execution-status'
    });


    Model.ID_SCHEDULED = 1;
    Model.ID_RUNNING = 2;
    Model.ID_COMPLETED = 3;
    Model.ID_ERROR = 4;
    Model.ID_TERMINATED = 5;

    return Model;
});