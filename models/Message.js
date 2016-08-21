var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MessageSchema = new mongoose.Schema({
    content: String,
    typeId: {
        type: Number,
        default: -1
    },
    transactionId: ObjectId,

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