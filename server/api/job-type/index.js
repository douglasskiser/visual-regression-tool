var controller = require('./job-type.controller');

module.exports = function(app) {
    app.get('/', controller.get);
    //app.get('/:id', controller.getOne);
};