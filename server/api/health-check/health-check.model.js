var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var HealthCheckSchema = new Schema({
    boxId: Number,
    status: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    script: String
});

module.exports = mongoose.model('HealthCheck', HealthCheckSchema);