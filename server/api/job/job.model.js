var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var JobSchema = new Schema({
    oldBoxId: Number,
    newBoxId: Number,
    scriptId: Number,
    deviceId: Number,
    typeId: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);