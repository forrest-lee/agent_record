var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MessageSchema = new mongoose.Schema({
    infoId: {type: ObjectId, ref: 'Information'},
    content: String,
    typeId: {
        type: Number,
        default: -1
    },  // 0: 通过, 1: 退回, 2: 否决
    ownerId: {type: ObjectId, ref: 'User'},

    createAt: Date,
    updateAt: Date
}, {collection: 'message'});


MessageSchema.pre('save', function(next) {
    if (this.isNew){
        this.createAt = this.updateAt = Date.now();
    }else{
        this.updateAt = Date.now();
    }
    next();
});


module.exports = mongoose.model('Message', MessageSchema);