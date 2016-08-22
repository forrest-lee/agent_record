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