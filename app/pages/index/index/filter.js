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

        that.options.boxCollection.toDropdown(that.controls.oldBoxIds, {
            placeholder: "Select one or multiple boxes",
            multiple: true,
            allowNew: false,
            allowClear: true
        });
        that.options.boxCollection.toDropdown(that.controls.newBoxIds, {
            placeholder: "Select one or multiple boxes",
            multiple: true,
            allowNew: false,
            allowClear: true
        });
        that.options.scriptCollection.toDropdown(that.controls.scriptIds, {
            placeholder: "Select one or multiple scripts",
            multiple: true,
            allowNew: false,
            allowClear: true
        });
        that.options.deviceCollection.toDropdown(that.controls.deviceIds, {
            placeholder: "Select one or multiple devices",
            multiple: true,
            allowNew: false,
            allowClear: true
        });

        that.controls.statuses.select2({
            multiple: true,
            placeholder: "Select one or multiple status",
            allowClear: true,
            data: _.map(Execution.STATUSES, function(name, key) {
                return {
                    id: key,
                    text: name
                }
            }),
            createSearchChoice: undefined
        });
    };

    View.prototype.serialize = function() {
        var that = this;
        var data = Super.prototype.serialize.call(that);
        data.oldBoxIds = that.controls.oldBoxIds.val();
        data.newBoxIds = that.controls.newBoxIds.val();
        data.scriptIds = that.controls.scriptIds.val();
        data.deviceIds = that.controls.deviceIds.val();
        return data;
    };
    
    View.prototype.clearFields = function() {
        var that = this;
        that.controls.oldBoxIds.select2('data', null);
        that.controls.newBoxIds.select2('data', null);
        that.controls.scriptIds.select2('data', null);
        that.controls.deviceIds.select2('data', null);
    };


    View.prototype.getFieldTemplate = function(){
        return Template;
    };
    

    return View;
});