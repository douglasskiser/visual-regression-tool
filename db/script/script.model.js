var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var ScriptSchema = new Schema({
    id: Number,
    name: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    nbOfScreenshots: {
        type: Date,
        default: 0
    },
    code: String,
    typeId: Number
});

module.exports = mongoose.model('Script', ScriptSchema);