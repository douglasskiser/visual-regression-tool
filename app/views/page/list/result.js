/*global _, _s, Backbone*/
define(function(require) {
    var Super = require('views/base'),
        B = require('bluebird'),
        Table = require('views/controls/table'),
        Template = require('hbs!./result.tpl');


    var View = Super.extend({

    });

    View.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);
    };

    View.prototype.render = function() {
        var that = this;
        return B.resolve()
            .then(function() {
                that.$el.html(that.getTemplate()({
                    id: that.id,
                    data: that.options.params
                }));
                 that.mapControls();
            })
            .then(function() {
                console.log('about to call renderTable()');
                return that.renderTable();
            })
            .then(function() {
               

                var events = {};
                events['click ' + that.toId('search')] = 'searchButtonClickHandler';
                events['click ' + that.toId('clear')] = 'clearButtonClickHandler';
                that.delegateEvents(events);
            })
            .then(function() {
                that.postRender();
            });
    };

    View.prototype.renderTable = function() {
        console.log('called renderTable()');
        var that = this;
        var TableClass = that.getTableClass();
        
        console.log(that.controls);

        var options = {
            el: that.controls.table,
            collection: that.collection
        };
        
        _.extend(options, that.getTableOptions());
        

        that.children.table = new TableClass(options);
        
        that.children.table.on('sort', that.tableSortHandler.bind(that));
        that.children.table.render();

        return B.resolve();
    };
    
    View.prototype.tableSortHandler = function(event){
        var that = this;
        that.trigger('sort', event);
    };
    
    View.prototype.getTableOptions = function(){
        return {};
    };

    View.prototype.postRender = function() {

    };

    View.prototype.getTableClass = function() {
        return Table;
    };


    View.prototype.getTemplate = function() {
        return Template;
    };


    return View;


});