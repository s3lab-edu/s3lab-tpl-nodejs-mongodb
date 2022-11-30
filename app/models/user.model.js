/**
 * Created by s3lab. on 1/13/2017.
 */
// third party components
const Mongoose = require('mongoose');

// our components
// const PagedFind = require('./plugins/pagedFind'); // cái này là cái gì v tời :===

let Schema = Mongoose.Schema;

// We have 2 default user in this system: sadmin:sadmin, anonymous:anonymous
let UserSchema = new Schema({
    loginName: {
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        minlength: 4,
        maxlength: 64,
        default: 'NONE'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.index({loginName: 'text', displayName: 'text'});

UserSchema.virtual('id')
    .get(function(){ return this.get('_id');})
    .set(function(value){return this.set('_id',value);});

UserSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret.__v;
    }
});

UserSchema.pre('save', function (next) {
    let currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

// UserSchema.plugin(PagedFind);

module.exports = Mongoose.model('user', UserSchema);
