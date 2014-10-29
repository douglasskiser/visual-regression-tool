/*
 * GET home page.
 */

module.exports = function (app) {
    var controller = app.controllers.scriptBox;

    app.get('/rest/collection/script-box', controller.fetchMany);
};