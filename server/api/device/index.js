var controller = require('./device.controller');

module.exports = function(app) {
    app.get('/rest/model/device', controller.get);
    app.get('/rest/device', controller.get);
    
    app.get('/rest/model/device/:id', controller.getOne);
    app.get('/rest/device/:id', controller.getOne);
    
    app.post('/rest/model/device/create', controller.create);
    app.post('/rest/device/create', controller.create);
    
    app.put('/rest/model/device/:id', controller.update);
    app.put('/rest/device/:id', controller.update);
    
    app.delete('/rest/model/device/:id', controller.delete);
    app.delete('/rest/device/:id', controller.delete);
    
    return app;
};