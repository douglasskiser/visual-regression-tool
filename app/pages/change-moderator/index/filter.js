/*global _, _s*/
define(function(require) {
    var Super = require('views/page/list/filter'),
        B = require('bluebird'),
        Execution = require('models/execution'),
        Template = require('hbs!./filter.tpl');


    var View = Super.extend({

    });

    View.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);
    };



    View.prototype.postRender = function() {
        var that = this;

       
         that.options.statusCollection.toDropdown(that.controls.statusIds, {
            placeholder: "Select one or multiple status",
            multiple: true,
            allowNew: false,
            allowClear: true
        });
        
    };

    View.prototype.serialize = function() {
        var that = this;
        var data = Super.prototype.serialize.call(that);
        data.statusIds = that.controls.statusIds.val();
        return data;
    };
    
    View.prototype.clearFields = function() {
        var that = this;
        that.controls.statusIds.select2('data', null);
    };


    View.prototype.getFieldTemplate = function(){
        return Template;
    };
    

    return View;
});