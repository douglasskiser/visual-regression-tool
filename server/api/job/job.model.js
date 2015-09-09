var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var JobSchema = new Schema({
    id: Number,
    oldBoxId: Number,
    newBoxId: Number,
    scriptId: Number,
    deviceId: Number,
    type: String,
    typeId: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);