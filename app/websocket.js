/*global Backbone, _*/
define(function(require) {
    var Super = Backbone.Model,
        Model = Super.extend({});

    Model.prototype.initialize = function(options) {};

    Model.prototype.emit = function(route, data) {
        this.webSocket.emit(route, data || null);
    };
    
    Model.prototype.on = function(route, cb) {
        cb = cb || function() {};
        this.webSocket.on(route, cb);
    };

    return Model;
});