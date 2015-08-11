var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var DeviceSchema = new Schema({
    id: Number,
    name: String,
    width: Number,
    height: Number
});

DeviceSchema.methods = {
    docName: 'Device'
};

module.exports = mongoose.model('Device', DeviceSchema);