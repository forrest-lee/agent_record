var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AttachmentSchema = new mongoose.Schema({
    owner:        {type: ObjectId, ref: 'User'},    // 用户ID
    userAttachId: {type: String, unique: true},      //  用户ID + 附件hashID
    
    filename: String,
    infoId:   {type: ObjectId, ref: 'Information'},
    url:      String,        // 七牛返回的url
    status:   {type: Number, default: 0},       // 用于拓展, 默认为0
    
    createAt: Date,
    updateAt: Date
}, {collection: 'Attachment'});


AttachmentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now();
    } else {
        this.updateAt = Date.now();
    }
    next();
});


module.exports = mongoose.model('Attachment', AttachmentSchema);