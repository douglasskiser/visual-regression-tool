var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var JobTypeSchema = new Schema({
    id: Number,
    name: String,
    scriptTemplate: String
});

module.exports = mongoose.model('JobType', JobTypeSchema);