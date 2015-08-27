var controller = require('./job-type.controller');

module.exports = function(app) {
    app.get('/rest/model/jobtype', controller.get);
    app.get('/rest/model/jobtype/:id', controller.getOne);
    app.post('/rest/model/jobtype/create', controller.create);
    app.put('/rest/model/jobtype/:id', controller.update);
    app.delete('/rest/model/jobtype/:id', controller.delete);
};