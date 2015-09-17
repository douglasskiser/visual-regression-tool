define(function(require) {
    var Super = require('./base'),
        HTML = require('hbs!./execution-status/html.tpl');

    var Model = Super.extend({
        name: 'execution-status'
    });


    // Model.ID_SCHEDULED = 1;
    // Model.ID_RUNNING = 2;
    // Model.ID_COMPLETED = 3;
    // Model.ID_ERROR = 4;
    // Model.ID_TERMINATED = 5;
    
    Model.ID_SCHEDULED = '55f19f841309203f03000033';
    Model.ID_RUNNING = '55f19f841309203f03000034';
    Model.ID_COMPLETED = '55f19f841309203f03000035';
    Model.ID_ERROR = '55f19f841309203f03000036';
    Model.ID_TERMINATED = '55f19f841309203f03000037';
    

    Model.prototype.toHTML = function() {
        var that = this;
        switch (that.id) {
            case Model.ID_SCHEDULED:
                return HTML({
                    text: that.get('name'),
                    iconClassName: 'fa-calendar'
                });
            case Model.ID_RUNNING:
                return HTML({
                    className: 'text-info',
                    text: that.get('name'),
                    iconClassName: 'fa-spin fa-spinner'
                });

            case Model.ID_COMPLETED:
                return HTML({
                    className: 'text-success',
                    text: that.get('name'),
                    iconClassName: 'fa-smile-o'
                });

            case Model.ID_ERROR:
                return HTML({
                    className: 'text-danger',
                    text: that.get('name'),
                    iconClassName: 'fa-frown-o'
                });

            case Model.ID_TERMINATED:
                return HTML({
                    className: 'text-warning',
                    text: that.get('name'),
                    iconClassName: 'fa-exclamation-triangle'
                });


        }
    };
    return Model;
});