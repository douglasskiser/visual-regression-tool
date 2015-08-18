var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var BoxSchema = new Schema({
    url: String,
    name: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

BoxSchema.methods = {
      
};

module.exports = mongoose.model('Box', BoxSchema);