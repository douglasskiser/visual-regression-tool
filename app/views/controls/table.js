/*global _, _s, Backbone*/
define(function(require) {
    var Super = require('views/base'),
        B = require('bluebird'),
        THEAD = require('hbs!./table/thead.tpl'),
        TBODY = require('hbs!./table/tbody.tpl'),
        TD = require('hbs!./table/td.tpl'),
        TR = require('hbs!./table/tr.tpl'),
        Template = require('hbs!./table.tpl');


    var View = Super.extend({});

    View.Columns = Backbone.Collection.extend();

    View.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);
        this.columns = this.getColumns();
    };

    View.prototype.render = function() {
        var that = this;
        return B.resolve()
            .then(function() {

                that.$el.html(Template({
                    id: that.id
                }));

                that.mapControls();
                console.log('about to call renderHead()');
                that.renderHead();
                that.renderBody();

                var events = {};
                that.delegateEvents(events);

                that.collection.on('sync add remove', that.renderBody.bind(that));
            });

    };

    View.prototype.renderHead = function() {
        var that = this;
        console.log('renderHead()', that.columns.toJSON());
        that.controls.thead.html(THEAD({
            id: that.id,
            columns: that.columns.map(function(column, index) {
                return that.tranformColumn(column, index);
            })
        }));
    };

    View.prototype.getColumns = function() {
        return new View.Columns();
    };


    View.prototype.tranformColumn = function(column, index) {
        return column.toJSON();
    };


    View.prototype.renderBody = function() {
        var that = this;
        that.controls.tbody.html(TBODY({
            id: that.id,
            rows: that.collection.map(function(model, index) {
                return that.tranformRow(model, index);
            }),
            columns: that.columns.toJSON()
        }));
    };

    View.prototype.tranformRow = function(model, index) {
        var that = this;
        var DefaultRenderer = that.getDefaultRenderer();
        var cells = that.columns.map(function(column, columnIndex) {
            var value = '&nbsp;';
            var renderer = column.get('renderer') || DefaultRenderer;
            var td = column.get('td') || TD;


            if (typeof renderer === 'function') {
                value = renderer(model, column, index, columnIndex);
            }
            if (typeof td === 'function') {
                return td({
                    value: value,
                    field: column.id,
                    data: model.toJSON(),
                    column: column.toJSON(),
                    rowIndex: index,
                    columnIndex: columnIndex,
                    className: column.get('className')
                });
            }
        });

        return TR({
            data: model.toJSON(),
            cells: cells.join('')
        });

    };

    View.prototype.getDefaultRenderer = function() {
        return function(model, column, rowIndex, columnIndex) {
            return model.get(column.id);
        };
    };

    return View;


});