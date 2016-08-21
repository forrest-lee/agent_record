var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TransactionSchema = new mongoose.Schema({
    title: String,
    agentId: { type: ObjectId, ref: 'User'},
    agentName: {type: String},
    

    createAt: Date,
    updateAt: Date
}, {collection: 'transaction'});


TransactionSchema.pre('save', function(next) {
    if (this.isNew){
        this.createAt = this.updateAt = Date.now();
    }else{
        this.updateAt = Date.now();
    }
    next();
});


module.exports = mongoose.model('transaction', TransactionSchema);