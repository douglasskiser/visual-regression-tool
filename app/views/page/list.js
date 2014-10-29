/*global _, _s, Backbone*/
define(function(require) {
    var Super = require('views/page'),
        B = require('bluebird'),
        Filter = require('./list/filter'),
        Result = require('./list/result'),
        Template = require('hbs!./list.tpl');

    var Page = Super.extend({});

    Page.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);
    };

    Page.prototype.render = function() {
        var that = this;

        return B.resolve(that.preRender())
            .then(function() {
                var data = {
                    id: that.id
                };
                return B.resolve(that.getRenderOptions())
                    .then(function(opts) {
                        _.extend(data, opts);
                        that.$el.html(Template(data));
                        that.mapControls();
                    });
            })
            .then(function() {
                return that.renderFilter();
            })
            .then(function() {
                return that.renderResult();
            })
            .then(function() {
                return that.renderPaginator();
            })
            .then(function() {
                return that.fetch();
            })
            .then(function() {
                var events = {};
                that.delegateEvents(events);
            })
            .then(function() {
                return that.postRender();
            })
            .finally(function() {
                that.ready();
            });
    };

    Page.prototype.getRenderOptions = function() {
        return B.resolve();
    };

    Page.prototype.preRender = function() {
        return B.resolve();
    };

    Page.prototype.postRender = function() {
        return B.resolve();
    };

    Page.prototype.getFilterClass = function() {
        return Filter;
    };

    Page.prototype.getResultClass = function() {
        return Result;
    };

    Page.prototype.renderResult = function() {
        console.log('call renderResult()');
        var that = this;
        var ResultClass = that.getResultClass();
        var params = {
            el: that.controls.result,
            collection: that.collection
        };
        _.extend(params, that.getResultOptions());

        that.children.result = new ResultClass(params);

        return that.children.result.render();
    };

    Page.prototype.getResultOptions = function() {};

    Page.prototype.renderPaginator = function() {};


    Page.prototype.renderFilter = function() {
        var that = this;
        var params = {
            el: that.controls.filter,
            params: that.options.params
        };
        _.extend(params, that.getFilterOptions());
        var FilterClass = that.getFilterClass();

        that.children.filter = new FilterClass(params);

        that.children.filter.on('search', that.refresh.bind(that));

        return that.children.filter.render();
    };

    Page.prototype.getFilterOptions = function() {
        return {};
    };


    Page.prototype.pagerButtonClickHandler = function(event) {
        var that = this;
        event.preventDefault();
        var page = parseInt(this.controls.page.val(), 10) || 1;
        var proceed = function() {
            that.controls.page.val(page);
            that.refresh();
        }
        var e = $(event.currentTarget);

        if (e.data('direction') == 'prev' && page > 1) {
            page--;
            proceed();
        }
        else if (e.data('direction') == 'next' && that.collection.length == (that.options.params.perPage || 10)) {
            page++;
            proceed();
        }

    };



    Page.prototype.refresh = function() {
        var that = this;
        that.reload(that.children.filter.serialize(), {
            trigger: false,
            replace: true
        });
        that.fetch();
    };

    Page.prototype.fetch = function() {
        var that = this;
        return that.collection.fetch({
            data: that.children.filter.serialize()
        });
    };


    return Page;


});