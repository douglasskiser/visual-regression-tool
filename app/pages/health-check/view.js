/*global _, _s, ace*/
define(function(require) {
    var Super = require('views/page/view'),
        B = require('bluebird'),
        Box = require('models/box'),
        FIELDS = require('hbs!./view/fields.tpl'),
        BUTTONS = require('hbs!./view/buttons.tpl'),
        Model = require('models/health-check'),
        Ace = require('ace');

    var Page = Super.extend({});

    Page.prototype.getPageName = function() {
        return 'Health Check #' + this.options.params.id;
    };

    Page.prototype.getModelClass = function() {
        return Model;
    };

    Page.prototype.getFieldsTemplate = function() {
        return FIELDS;
    };

    Page.prototype.getButtonsTemplate = function() {
        return BUTTONS;
    };


    // Page.prototype.postRender = function() {
    // var that = this;
    // that.editor = ace.edit(that.controls.script.get(0));
    // that.editor.setTheme("ace/theme/monokai");
    // that.editor.getSession().setMode("ace/mode/javascript");
    // };

    Page.prototype.preRender = function() {
        var that = this;
        that.box = new Box({
            id: that.model.get('boxId')
        });
        return that.box.fetch();

    };
    Page.prototype.prepareForOutput = function() {
        var that = this;
        return _.extend(this.model.toJSON(), {
            boxUrl: that.box.get('url')
        });
    };

    return Page;


});