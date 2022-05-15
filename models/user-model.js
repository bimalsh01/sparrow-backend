const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {type:String, require:true},
    fname:{type:String, require:false, default:"Test"},
    lname:{type:String, require:false,default:"Test"},
    username:{type:String, require:false,default:"Test"},
    secondaryEmail:{type:String, require:false},
    address:[
        {
            state:{type:String, require:false},
        },
        {
            city:{type:String, require:false},
        }
    ],

    profile: {type:String, required:false, get:(profile) => {
        return `${process.env.BASE_URL}${profile}`;
    }},
    password: {type:String, require:true, default:"Test"},
    activated:{type:Boolean, require:false, default:false},
    followers:{type:Number, require:false, default:49},
    following:{type:Number, require:false, default:55},

},{
    timestamps:true.valueOf,
    toJSON: {getters:true}
})

module.exports = mongoose.model('User',userSchema,'users');