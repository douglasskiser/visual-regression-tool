var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var HealthCheckSchema = new Schema({
    boxId: Schema.Types.ObjectId,
    status: Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    script: String
});

module.exports = mongoose.model('HealthCheck', HealthCheckSchema);