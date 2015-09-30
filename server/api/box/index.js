var controller = require('./box.controller');

module.exports = function(app) {
    app.get('/rest/box', controller.get);
    app.get('/rest/box/:id', controller.getOne);
    app.post('/rest/box/create', controller.create);
    app.put('/rest/box/:id', controller.update);
    app.delete('/rest/box/:id', controller.delete);
    
    return app;
};