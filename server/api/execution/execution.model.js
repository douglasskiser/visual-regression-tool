var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExecutionSchema = new Schema({
    jobId: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

module.exports = mongoose.model('Execution', ExecutionSchema);