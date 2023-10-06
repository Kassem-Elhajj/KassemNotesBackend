const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "PLease enter a Title for the note!"]
    },

    subject: {
        type: String,
        default: ''
    },

    description: {
        type: String,
        default: ''
    },

    notePicturePath: {
        type: String,
        default: ''
    },

    noteAudioPath: {
        type: String,
        default: ''
    },

    userId: {
        type: String,
        required: true
    }

}, {timestamps: true})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note