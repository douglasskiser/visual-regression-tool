/*global _, _s*/
define(function(require) {
    var Super = require('views/controls/table'),
        B = require('bluebird'),
        JOB = require('hbs!./job.tpl'),
        ACTION = require('hbs!./action.tpl'),
        CREATED_AT_ID = require('hbs!./created-at-td.tpl'),
        UPDATED_AT_ID = require('hbs!./updated-at-td.tpl');

    var View = Super.extend();

    View.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);

    };

    View.prototype.getColumns = function() {
        var that = this;
        return new View.Columns([{
            id: '_id',
            name: '#',
            type: 'number',
            sortable: true
        }, {
            id: 'jobId',
            name: 'Job #',
            type: 'text',
            sortable: true,
            renderer: function(model, column, rowIndex, columnIndex) {
                return JOB({
                    id: model.get('jobId')
                });
            }
        }, {
            id: 'createdAt',
            name: 'Date Created',
            type: 'number',
            sortable: true,
            td: CREATED_AT_ID,
            direction: 'desc',
            renderer: function(model, column, rowIndex, columnIndex) {
                return model.get('createdAt');
            }
        }, {
            id: 'updatedAt',
            name: 'Date Last Updated',
            type: 'number',
            sortable: true,
            td: UPDATED_AT_ID,
            renderer: function(model, column, rowIndex, columnIndex) {
                return model.get('updatedAt');
            }
        }, {
            id: 'status',
            name: 'Status',
            type: 'text',
            sortable: true,
            renderer: function(model, column, rowIndex, columnIndex) {
                return that.options.statusCollection.get(model.get('statusId')).toHTML();
            }
        }, {
            id: 'action',
            renderer: function(model, column, rowIndex, columnIndex) {
                return ACTION({
                    id: model._id
                });
            }
        }]);
    };


    return View;


});