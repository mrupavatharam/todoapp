const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var UserScheama = mongoose.Schema({
    
        name:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            trim: true,
            required:true,
            unique:true,
            validate:{
                validator : (value) => validator.isEmail(value),
                message : '{VALUE} is not a valid email'
            }
        },
        password:{
            type: String,
            required: true,
            minlength:6,
        },
        tokens:[
            {
                access: {
                    type: String,
                    required: true
                },
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    })

UserScheama.methods.generateAuthTokens = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(), access},'abc123def456').toString();
    user.tokens.push({access, token});
    return user.save().then( ()=> {    //return should be there else token will not be returned (only saves)
        console.log("in modal",token);
        return token;
    });
}

var User = mongoose.model('User', UserScheama);

module.exports = { User };


