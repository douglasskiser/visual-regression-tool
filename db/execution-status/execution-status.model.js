var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExecutionStatusSchema = new Schema({
    id: Number,
    name: String
});

module.exports = mongoose.model('ExecutionStatus', ExecutionStatusSchema);