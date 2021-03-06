define(function(require) {
    var _ = require('underscore'),
        Super = require('./base'),
        Model = require('../models/device');

    var Collection = Super.extend({
        model: Model
    });
    
    
    Collection.prototype.toDropdown = function(target, options) {
        var that = this;
        
        var formatResult = function(object, container, query) {
            var model = that.get(object.id);
            return [model.get('name'), ' - ', model.get('width'), 'x', model.get('height')].join('');
        };
        var formatSelection = function(object, container) {
            var model = that.get(object.id);
            return [model.get('name'), ' - ', model.get('width'), 'x', model.get('height')].join('');
        };

        var opts = _.extend({}, {
            placeholder: "Select a device",
            allowClear: false,
            formatResult: formatResult,
            formatSelection: formatSelection,
            data: that.map(function(model) {
                return {
                    id: model.id,
                    text: model.get('name')
                };
            }),
            createSearchChoice: undefined
        }, options);
        
        return target.select2(opts);
    };
    

    return Collection;
});