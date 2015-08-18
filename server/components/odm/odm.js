var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    logger = require('../logger/logger'),
    B = require('bluebird'),
    mongoose = B.promisifyAll(require('mongoose'));
    
mongoose.initialize = function() {
    console.log('hello')
    if (!this.initialized) {
        
        this.initialized = true;
        
        return new B(function(resolve, reject) {
            mongoose.set('debug', (config.mongo.options || {}).debug);
            mongoose.connect(config.mongo.uri, config.mongo.options || {});
            
            mongoose.connection.on('error', function(err) {
                logger.errorAsync('MongoDB connection failed!', err);
                reject(err);
            });
            
            mongoose.connection.once('open', function() {
                logger.info('MongoDB connection established.');
                resolve();
            });
        });
    }
    return B.resolve();
};

module.exports = mongoose;