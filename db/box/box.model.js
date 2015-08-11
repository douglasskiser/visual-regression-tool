var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var BoxSchema = new Schema({
    id: Number,
    url: String,
    name: String,
    createdAt: Number,
    updatedAt: Number
});

BoxSchema.methods = {
    docName: 'Box'
};

module.exports = mongoose.model('Box', BoxSchema);