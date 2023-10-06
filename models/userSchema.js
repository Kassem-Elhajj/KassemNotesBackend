const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        minlength: [6, "Username is too short, it needs to be at least 6 characters"],
        unique: true,
        required: [true, 'Please enter your username']
    },
    password : {
        type: String,
        minlength: [8, "Password is too short, it needs to be at least 8 characters"],
        required: [true, 'Please enter a password']
    },
    picturePath: {
        type: String,
        default: ''
    },
    birthDate: {
        type: Date,
        required: [true, 'Please enter you BirthDate']
    }
},{timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User