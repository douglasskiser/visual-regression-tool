var controller = require('./device.controller');

module.exports = function(app) {
    app.get('/rest/model/device', controller.get);
    app.get('/rest/model/device/:id', controller.getOne);
    app.post('/rest/model/device/create', controller.create);
    app.put('/rest/model/device/:id', controller.update);
    app.delete('/rest/model/device/:id', controller.delete);
};