var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var JobSchema = new Schema({
    oldBoxId: String,
    newBoxId: String,
    scriptId: String,
    deviceId: String,
    typeId: {
        type: Number,
        default: 1
    },
    type: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);