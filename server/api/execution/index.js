var controller = require('./execution.controller'),
    Execution = require('./execution.model'),
    errors = require('../../components/errors/errors'),
    Agenda = require('../../components/agenda/agenda');

module.exports = function(app) {
    var agenda = new Agenda(app, {});
    
    app.get('/rest/execution', controller.get);
    app.get('/rest/execution/:id', controller.getOne);
    app.post('/rest/execution', controller.create);
    app.put('/rest/execution/:id', controller.update);
    app.delete('/rest/execution/:id', controller.delete);
    // app.post('/execution/:id/run', controller.run);
    app.get('/execution/:id/screenshots', controller.screenshots);
    
    app.get('/execution/:id/run', function(req, res) {
        Execution.findById(req.params.id, function(err, exc) {
            if (err) {
                errors.handleResponseError(res, 500, err);
            }
            console.log('EXC: ', exc);
            agenda.create(exc);
            res.send(200);
        })
    });
    
    agenda.start();
    
    return app;
};