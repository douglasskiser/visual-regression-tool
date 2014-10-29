/*global _, _s*/
define(function(require) {
    var Super = require('views/controls/table'),
        B = require('bluebird'),
        Execution = require('models/execution'),
        DescriptionTemplate = require('hbs!./description.tpl'),
        ActionTemplate = require('hbs!./action.tpl'),
        CreatedAtTDTemplate = require('hbs!./created-at-td.tpl'),
        UpdatedAtTDTemplate= require('hbs!./updated-at-td.tpl');


    var View = Super.extend();

    View.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);
        
    };
    

    View.prototype.getColumns = function() {
        var that = this;
        return new View.Columns([{
            id: 'id',
            name: '#'
        }, {
            id: 'description',
            name: 'Description',
            renderer: function(model, column, rowIndex, columnIndex) {
                return DescriptionTemplate({
                    oldBox: that.options.boxCollection.get(model.get('oldBoxId')).toJSON(),
                    newBox: that.options.boxCollection.get(model.get('newBoxId')).toJSON(),
                    script: that.options.scriptCollection.get(model.get('scriptId')).toJSON(),
                    device: that.options.deviceCollection.get(model.get('deviceId')).toJSON()
                    
                });
            }
        }, {
            id: 'status',
            name: 'Status',
            renderer: function(model, column, rowIndex, columnIndex) {
                return Execution.STATUSES[model.get('status')];
            }
        }, {
            id: 'createdAt',
            name: 'Date Created',
            className: 'hidden-xs hidden-sm',
            td: CreatedAtTDTemplate,
            renderer: function(model, column, rowIndex, columnIndex) {
                return model.get('createdAt');
            }
        }, {
            id: 'updatedAt',
            name: 'Date Last Updated',
            td: UpdatedAtTDTemplate,
            renderer: function(model, column, rowIndex, columnIndex) {
                return model.get('updatedAt');
            }
        }, {
            id: 'action',
            renderer: function(model, column, rowIndex, columnIndex) {
                return ActionTemplate({
                    id: model.id
                });
            }
        }]);
    };
    

    return View;


});