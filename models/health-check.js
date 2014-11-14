var Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    logger = require('../logger'),
    fs = require('fs'),
    path = require('path'),
    Box = require('models/box'),
    Model = Super.extend({
        tableName: 'HealthCheck'
    });

Model.getScriptAbsPath = function(model) {
    return path.join(config.rootPath, 'background', 'health-check', 'scripts', model.id + '.js');
};


Model.prototype.format = function(attrs) {
    var that = this;
    if (that.hasChanged('script') && !_.isEmpty(attrs['script'])) {
        //write the script to the file
        fs.writeFile(that.getScriptAbsPath(), attrs['script'], function(err) {
            if (err) throw err;
        });
    }
    return attrs;
};

Model.prototype.getScriptAbsPath = function(){
    return Model.getScriptAbsPath(this);
};


// Model.prototype.run = function(){
//     var that = this,
//         box = Box.forge({
//             id: that.get('boxId')
//         });
        
//         B.resolve(box.fetch())
//             .then(function(){
//                 var absPath = [config.rootPath, 'background', 'health-check', 'scripts'];
//                 var logPath = [config.rootPath, 'logs', that.id.toString() + '.log'].join('/');
                
//                 var cmd = [absPath, that.id.toString() + '.js'].join('/') +
//                 ' --url=' + box.get('url') + ' > ' + logPath;
                
//                 return new B(function(resolve, reject) {
//                                 nexpect.spawn(cmd)
//                                     .run(function(err, stdout, exitcode) {
//                                         resolve({
//                                             err: err,
//                                             stdout: stdout,
//                                             exitCode: exitcode
//                                         });
//                                     });
//                             });
//             })
// };

module.exports = Model;
