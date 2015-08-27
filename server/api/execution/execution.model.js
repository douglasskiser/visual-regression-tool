var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExecutionSchema = new Schema({
    jobId: String,
    oldBoxId: String,
    status: String,
    statusId: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

module.exports = mongoose.model('Execution', ExecutionSchema);