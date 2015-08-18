var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var JobTypeSchema = new Schema({
    name: String,
    scriptTemplate: String
});

module.exports = mongoose.model('JobType', JobTypeSchema);