/*global _, _s, ace*/
define(function(require) {
    var Super = require('views/page/edit'),
        B = require('bluebird'),
        FIELDS = require('hbs!./edit/fields.tpl'),
        Model = require('models/box'),
        Select2 = require('select2');


    var Page = Super.extend({});

    Page.prototype.getPageName = function() {
        console.log('MY ID IS ', this.params);
        //return 'Device' + (this.model.id ? (' #' + this.model.id) : '');
        return 'Device' + (this.params.id ? (' #' + this.params.id) : '');
    };

    Page.prototype.getModelClass = function() {
        return Model;
    };

    Page.prototype.getFieldsTemplate = function() {
        return FIELDS;
    };
    return Page;


});