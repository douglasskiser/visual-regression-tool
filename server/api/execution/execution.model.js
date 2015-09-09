var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExecutionSchema = new Schema({
    id: Number,
    jobId: Number,
    oldBoxId: Number,
    status: String,
    statusId: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Execution', ExecutionSchema);