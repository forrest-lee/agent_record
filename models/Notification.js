/**
 * Created by leo on 8/22/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var NotificationSchema = new mongoose.Schema({
    ownerId: {type: ObjectId, ref: 'User'},
    owner: String,
    title: String,
    content: String,
    
    createAt: Date,
    updateAt: Date
}, {collection: 'notification'});


NotificationSchema.pre('save', function(next) {
    if (this.isNew){
        this.createAt = this.updateAt = Date.now();
    }else{
        this.updateAt = Date.now();
    }
    next();
});


module.exports = mongoose.model('Notification', NotificationSchema);