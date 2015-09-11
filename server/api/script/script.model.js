var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var ScriptSchema = new Schema({
    name: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    nbOfScreenshots: {
        type: Number,
        default: 0
    },
    code: String,
    typeId: Schema.Types.ObjectId
});

module.exports = mongoose.model('Script', ScriptSchema);