define(function(require) {
    var Backbone = require('backbone'),
        io = require('socketIO'),
        _ = require('underscore'),
        _s = require('underscore.string'),
        $ = require('jquery'),
        Super = Backbone.Model;

    var urlError = function() {
            throw new Error('A "url" property or function must be specified.');
        },
        eventEmit = io.EventEmitter.prototype.emit,
        ajaxSync = Backbone.sync;

    var Model = Super.extend({
        idAttribute: '_id',
        url: function() {
            return '/rest/' + this.name + (this.id ? ':' + this.id : '');
        },
        sync: function(method, model, options) {
            var opts = _.extend({}, options),
                defer = $.Deferred(),
                promise = defer.promise(),
                namespace,
                socket;

            opts.url = this.name;

            if (!opts.url) {
                urlError();
            }

            namespace = Backbone.Model.prototype.namespace.call(this, opts.url);

            if (!opts.data && model) {
                opts.data = opts.attrs || model.toJSON(options) || {};
            }
            if ((opts.data.id === null || opts.data.id === void 0) && opts.patch === true && model) {
                opts.data.id = model.id;
            }

            socket = opts.socket || window.app.webSocket;
            
            socket.once('data:' + namespace + method, function(data) {
                var success = (data && !data.error);
                if (!data) {
                    defer.resolve();
                    return;
                }
                if (success) {
                    if (_.isFunction(options.success)) {
                        options.success(data);
                    }
                    defer.resolve(data);
                    return;
                }
                if (_.isFunction(options.error)) {
                    options.error(data);
                }

                defer.reject(data);
            });
            
            socket.emit(namespace + method, opts.data);

            model.trigger('request', model, promise, opts);

            return promise;
        },
        ajaxSync: function(method, model, options) {
            return ajaxSync.call(this, method, model, options);
        }
    });
    
    Backbone.Model.prototype.namespace = function(url){
        url = url || this.url();
        url = _s.trim(url, '/').replace('/', ':') + ":";

        return url;
    };
    
    io.EventEmitter.prototype.emit = function(name){
        var args = Array.prototype.slice.call(arguments, 1);

        eventEmit.apply(this, ['*', name].concat(args));
        eventEmit.apply(this, [name].concat(args));
    };
    
    io.SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;

    return Model;
});