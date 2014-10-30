/*
 * GET home page.
 */

module.exports = function (app) {
    var controller = app.controllers.device;

    // app.get('/rest/collection/device', controller.fetchMany);
    app.get('/rest/model/device/:id', controller.fetchOne);
};