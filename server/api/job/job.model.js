var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var JobSchema = new Schema({
    oldBoxId: Schema.Types.ObjectId,
    newBoxId: Schema.Types.ObjectId,
    scriptId: Schema.Types.ObjectId,
    deviceId: Schema.Types.ObjectId,
    typeId: Schema.Types.ObjectId,
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