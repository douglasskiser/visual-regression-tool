/*global _, _s, ace*/
define(function(require) {
    var Super = require('views/page/edit'),
        B = require('bluebird'),
        BoxCollection = require('collections/box'),
        ScriptCollection = require('collections/script'),
        DeviceCollection = require('collections/device'),
        FIELDS = require('hbs!./edit/fields.tpl'),
        Model = require('models/change-moderator'),
        Select2 = require('select2'),
        Ace = require('ace');


    var Page = Super.extend({});

    Page.prototype.getPageName = function() {
        return 'Change Moderator Job';
    };

    Page.prototype.getModelClass = function() {
        return Model;
    };

    Page.prototype.getFieldsTemplate = function() {
        return FIELDS;
    };

    Page.prototype.preRender = function() {
        var that = this;
        that.devices = new DeviceCollection();
        that.scripts = new ScriptCollection();
        that.boxes = new BoxCollection();

        return B.all([
            that.devices.fetch({
                data: {
                    columns: ['id', 'name', 'width', 'height'] // columns: ['_id', 'name', 'width', 'height']
                }
            }),
            that.scripts.fetch({
                data: {
                    columns: ['id', 'name', 'typeId'] // columns: ['_id', 'name', 'typeId']
                }
            }),
            that.boxes.fetch({
                data: {
                    columns: ['id', 'name', 'url'] // columns: ['_id', 'name', 'url']
                }
            })
        ]);
    };

    Page.prototype.postRender = function() {
        var that = this;
        that.boxes.toDropdown(that.controls.boxId);
        that.scripts.toDropdown(that.controls.scriptId);
        that.devices.toDropdown(that.controls.deviceId);
    };

    Page.prototype.getExtraEvents = function() {
        var that = this;
        var events = {};
        return events;
    };

    Page.prototype.prepareForOutput = function() {
        var that = this;
        var data = that.model.toJSON();

        return data;
    };

    return Page;


});