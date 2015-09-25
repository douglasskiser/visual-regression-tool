/* global Backbone, app*/

define(function(require) {

    //require the layout
    var Super = Backbone.Model,
        Layout = require('./views/layout'),
        Router = require('./router'),
        Config = require('./config'),
        Socket = require('./socket'),
        Toastr = require('toastr'),
        B = require('bluebird'),
        io = require('socketIO'),
        Cookies = require('jsCookie'),
        User = require('models/user');


    var App = Super.extend({});

    App.prototype.initialize = function(options) {
        Super.prototype.initialize.call(this, options);
    };

    App.prototype.initConfig = function() {
        this.config = new Config(window.config);
        return B.resolve();
    };

    App.prototype.initRouter = function() {
        this.router = new Router({
            app: this
        });
        return B.resolve();
    };

    App.prototype.initCookieStore = function() {
        this.cookieStore = Cookies;
        return B.resolve();
    };

    App.prototype.initWebSocket = function() {
        this.webSocket = io.connect();
        return B.resolve();
    };

    App.prototype.initSocket = function() {
        this.socket = new Socket({
            app: this
        });

        this.socket.on('error', function(jqXHR, statusCode, errorThrown) {
            var options = {
                code: statusCode,
                message: jqXHR.responseText
            };
            try {
                options = JSON.parse(jqXHR.responseText);
            }
            catch (e) {}
            Toastr.error(options.message);
        });

        return Promise.resolve();
    };

    App.prototype.initLayout = function() {
        this.layout = new Layout({
            app: this
        });

        return B.resolve();
    };

    function initAppUser() {
        if (app.cookieStore && app.cookieStore.get('token')) {
            return B.resolve(this.app.socket.request({
                    url: '/rest/user/me',
                    data: {},
                    type: 'GET',
                    headers: {
                        authorization: 'Bearer ' + app.cookieStore.get('token')
                    }
                }))
                .then(function(data) {
                    app.user = new User(data);
                })
                .catch(function() {
                    // that.toast.error('Incorrect username or password!');
                });
        } else {
            return B.resolve();
        }
    }

    App.prototype.run = function() {
        var that = this;

        return B.all([
            this.initConfig(),
            this.initLayout(),
            this.initSocket(),
            this.initWebSocket(),
            this.initRouter(),
            this.initCookieStore()
        ])
        .then(function() {
            return initAppUser();
        })
        .then(function() {
            return that.layout.render();
        }).then(function() {
            return that.router.start();
        });
    };

    Object.defineProperty(App.prototype, 'router', {
        get: function() {
            return this.get('router');
        },
        set: function(val) {
            this.set('router', val);
        }
    });

    Object.defineProperty(App.prototype, 'layout', {
        get: function() {
            return this.get('layout');
        },
        set: function(val) {
            this.set('layout', val);
        }
    });

    Object.defineProperty(App.prototype, 'config', {
        get: function() {
            return this.get('config');
        },
        set: function(val) {
            this.set('config', val);
        }
    });

    Object.defineProperty(App.prototype, 'socket', {
        get: function() {
            return this.get('socket');
        },
        set: function(val) {
            this.set('socket', val);
        }
    });

    Object.defineProperty(App.prototype, 'webSocket', {
        get: function() {
            return this.get('webSocket');
        },
        set: function(val) {
            this.set('webSocket', val);
        }
    });

    Object.defineProperty(App.prototype, 'user', {
        get: function() {
            return this.get('user');
        },
        set: function(val) {
            this.set('user', val);
        }
    });

    Object.defineProperty(App.prototype, 'token', {
        get: function() {
            return this.get('token');
        },
        set: function(val) {
            this.set('token', val);
        }
    });

    Object.defineProperty(App.prototype, 'cookieStore', {
        get: function() {
            return this.get('cookieStore');
        },
        set: function(val) {
            return this.set('cookieStore', val);
        }
    });

    return App;
});