var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Job = require('../job/job.model'),
    Box = require('../box/box.model'),
    Script = require('../script/script.model'),
    Device = require('../device/device.model'),
    B = require('bluebird');

var ExecutionSchema = new Schema({
    id: Number,
    jobId: Number,
    statusId: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

var handleError = function(err) {
    if (err) {
        console.log(err);
    }
    return;
};

ExecutionSchema.methods = {
    run: function() {
        var self = this; // check this
        Job.find({id: self.get('id')}, function(err, job) {
            if (err) {
                return handleError(err);
            }
            Box.find({id: job.oldBoxId}, function(err, oldBox) {
                 if (err) {
                    return handleError(err);
                }
                    Script.find({id: job.scriptId}, function(err, script) {
                        if (err) {
                            return handleError(err);
                        }
                        Device.find({id: job.deviceId}, function(err, device) {
                            if (err) {
                                return handleError(err);
                            }
                            
                            if (job.type === 'Visual Regression') {
                                Box.find({id: job.newBoxId}, function(err, newBox) {
                                    if (err) {
                                        return handleError(err);
                                    }
                                    
                                    return [oldBox, newBox, script, device];
                                });
                            }
                            
                            if (job.type === 'Changes Moderator') {
                                return [oldBox, script, device];
                            }
                        });
                    });
            });
        });
    }  
};

module.exports = mongoose.model('Execution', ExecutionSchema);