var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MessageSchema = new mongoose.Schema({
    infoId: {type: ObjectId, ref: 'Information'},
    content: String,
    status: {
        type: Number,
        default: -1
    },  // 1: 通过, 2: 否决, 3:退回
    ownerId: {type: ObjectId, ref: 'User'},
    ownerName: String,

    createAt: Date,
    updateAt: Date
}, {collection: 'Message'});


MessageSchema.pre('save', function(next) {
    if (this.isNew){
        this.createAt = this.updateAt = Date.now();
    }else{
        this.updateAt = Date.now();
    }
    next();
});


module.exports = mongoose.model('Message', MessageSchema);