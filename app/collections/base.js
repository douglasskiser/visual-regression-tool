/* global Backbone, _*/
define(function (require) {
    var Super = Backbone.Collection,
        Model = require('../models/base'),
        Collection = Super.extend({
                                      model: Model
                                  });

    
    Collection.prototype.fetch = function(options){
        
        var that = this;
        var name = that.name || that.model.prototype.name;
        
        var opts = {
            distinct: [],
            columns: {},
            selection: {},
            groupBy: [],
            having: [],
            orderBy:{},
            limit: undefined,
            offset: undefined
        };
        options = options || {};
        options.data = _.extend({}, opts, options.data);

        return Super.prototype.fetch.call(this, options);    
    };
    
    
    return Collection;
});