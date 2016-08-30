var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var InformationSchema = new mongoose.Schema({
    title:     String,
    agentId:   {type: ObjectId, ref: 'User'},
    agentName: {type: String},
    
    mobile:  String,
    name:    String,
    qq:      String,
    school:  String,
    comment: String,
    status:  {type: Number, default: -1},   // -1:正在编辑, 0:已提交(待审核)，1:已通过 ，2:已否决，3:已退回
    
    
    createAt: Date,
    updateAt: Date
}, {collection: 'Information'});


InformationSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now();
    } else {
        this.updateAt = Date.now();
    }
    next();
});


module.exports = mongoose.model('Information', InformationSchema);