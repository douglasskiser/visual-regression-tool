/* global app*/
define(function(require) {
    var _ = require('underscore'),
        Super = require('./base'),
        Model = require('../models/execution');

    var Collection = Super.extend({
        model: Model
    });

    Collection.prototype.initialize = function(options){
        var url;
        Super.prototype.initialize.call(this, options);
        if( _.isEmpty(_.result(this, 'url')) ){
            url = _.result(this.model.prototype, 'url');
            if( !_.isEmpty(url) ){
                this.url = url;
            }else{
                this.url = '/rest' + (this.name || this.model.prototype.name);
            }
        }

        this.createSocketListener.call(this);
    };
    
    Collection.prototype.createSocketListener = function() {
         app.webSocket.on('data:execution:status', this.onSocketHandler.bind(this));
         app.webSocket.on('data:execution:create', this.onExecutionCreateHandler.bind(this));
         app.webSocket.on('data:execution:delete', this.onExecutionDeleteHandler.bind(this));
    };
    
    Collection.prototype.onExecutionCreateHandler = function(data) {
        console.log('creating new model')
        var m = new Model(data);
        this.add(m);
    };
    
    Collection.prototype.onExecutionDeleteHandler = function(data) {
        var m = this.find(function(model) {
            return model.get('_id').toString() == data._id.toString();
        });
        
        this.remove(m);
        
        console.log('Item removed in socket');
    };
    
    Collection.prototype.onSocketHandler = function(data) {
        var subModel = this.find(function(model) {
            return model.get('_id').toString() == data._id.toString();
        });
        
        subModel.set({
            statusId: data.statusId
        });
        
        console.log('onSOcketHandler finished');
    };

    return Collection;
});