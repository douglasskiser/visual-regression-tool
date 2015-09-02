define(function(require) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        Super = Backbone.Model;

    var Model = Super.extend({
        url: function(){
          return '/rest/' + this.name + (this.id ? '/' + this.id : '');
          // return '/rest/' + this.name + (this._id ? '/' + this._id : '');
        } 
    });
    

    return Model;
});