var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExecutionSchema = new Schema({
    jobId: Schema.Types.ObjectId,
    oldBoxId: Schema.Types.ObjectId,
    statusId: Schema.Types.ObjectId,
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