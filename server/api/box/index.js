var controller = require('./box.controller');

module.exports = function(app) {
    app.get('/rest/model/box', controller.get);
    app.get('/rest/model/box/:id', controller.getOne);
    app.post('/rest/model/box/create', controller.create);
    app.put('/rest/model/box/:id', controller.update);
    app.delete('/rest/model/box/:id', controller.delete);
    return app;
};