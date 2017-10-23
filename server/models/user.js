const mongoose = require('mongoose');

var User = mongoose.model('User',{
    
        name:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            trim: true,
            required:true
        }
    });

module.exports = { User };