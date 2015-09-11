var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExecutionStatusSchema = new Schema({
    name: String
});

module.exports = mongoose.model('ExecutionStatus', ExecutionStatusSchema);