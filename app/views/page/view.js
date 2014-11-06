/*global _, _s*/
define(function(require) {
    var Super = require('views/page'),
        B = require('bluebird'),
        NProgress = require('nprogress'),
        HEADER = require('hbs!./view/header.tpl'),
        FIELDS = require('hbs!./view/fields.tpl'),
        FORM = require('hbs!./view/form.tpl'),
        BUTTONS = require('hbs!./view/buttons.tpl'),
        Ladda = require('ladda'),
        Template = require('hbs!./view.tpl');

    var Page = Super.extend({});

    Page.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);
        this.model = this.getModel();
    };

    Page.prototype.getModel = function() {
        var Model = this.getModelClass();
        return new Model({
            id: this.options.params.id
        });
    };

    Page.prototype.getModelClass = function() {
        throw new Error("You must define Page.prototype.getModelClass()");
    };


    Page.prototype.render = function() {
        var that = this;

        B.resolve(that.fetch())
            .then(function() {
                return that.preRender();
            })
            .then(function() {
                var data = that.prepareForOutput();

                that.$el.html(Template({
                    id: that.id,
                    header: that.getHeaderHtml(data),
                    form: that.getFormHtml(data)
                }));

                that.mapControls();

                that.initializeEvents();
            })
            .then(function() {
                return that.postRender();
            })
            .then(function() {
                that.ready();
            });
    };
    
    Page.prototype.fetch = function(){
        return this.model.fetch();
    };
    
    Page.prototype.getPageName = function() {
        return '';
    };

    Page.prototype.preRender = function() {
        return B.resolve();
    };

    Page.prototype.postRender = function() {
        return B.resolve();
    };
    Page.prototype.getHeaderTemplate = function() {
        return HEADER;
    };

    Page.prototype.getHeaderHtml = function(data) {
        var that = this;
        var template = that.getHeaderTemplate();

        return template({
            id: that.id,
            data: data,
            name: that.getPageName()
        });
    };

    Page.prototype.getFormHtml = function(data) {
        var that = this;
        var template = that.getFormTemplate();

        return template({
            id: that.id,
            fields: that.getFieldsHtml(data),
            buttons: that.getButtonsHtml(data)
        });
    };

    Page.prototype.getFormTemplate = function() {
        return FORM;
    };

    Page.prototype.getFieldsHtml = function(data) {
        var that = this;
        var template = that.getFieldsTemplate();
        return template({
            id: that.id,
            data: data
        });
    };

    Page.prototype.getFieldsTemplate = function() {
        return FIELDS;
    };


    Page.prototype.getButtonsHtml = function(data) {
        var that = this;
        var template = that.getButtonsTemplate();

        return template({
            id: that.id,
            data: data
        });
    };

    Page.prototype.getButtonsTemplate = function() {
        return BUTTONS;
    };

    Page.prototype.initializeEvents = function() {
        var that = this;
        var events = {};
        events['click ' + that.toId('back')] = 'backButtonClickHandler';
        _.extend(events, that.getExtraEvents());
        that.delegateEvents(events);
    };

    Page.prototype.getExtraEvents = function() {

    };

    Page.prototype.prepareForOutput = function() {
        return this.model.toJSON();
    };

    return Page;


});