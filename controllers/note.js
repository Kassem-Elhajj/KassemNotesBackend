const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const User = require('../models/userSchema')
const Note = require('../models/noteSchema')

const post1 = async (req, res) => {

    try{

        const username = req.params.username
        const {title, subject, description} = req.body
        const notePicture = req.file
        let notePicturePath = 'notePictures/picture not founded.png'

        const user = await User.findOne({username: username})
        const userId = user._id
        // console.log(`userId: ${userId}`)

        if(notePicture){
            notePicturePath = await req.file.path.slice(14)
        }

        const note = await Note.create({title, subject, description, notePicturePath, userId})

        res.json({status: 'ok', note: note})

    }catch(err){
        res.json({status: 'failed', message: err.message})
    }

}

const post2 = async (req, res) => {

    try{

        const noteId = req.params.noteId
        const noteAudio = req.file
        
        if(noteAudio){
            const note = await Note.findById(noteId)
            note.noteAudioPath = await noteAudio.path.slice(14)
            note.save()
            return res.json({status: 'ok', noteAudioPath: note.noteAudioPath})
        }

        res.json({status: 'ok', message: 'user did not insert an audio'})

    }catch(err){
        res.json({status: 'failed', message: err.message})
    }

}

const getNotes = async (req, res) => {

    try{

        const sort = req.params.sort
        const username = req.params.username
        let authorized = true

        //! Making sure that the client is requesting his data not someone else
        token = req.cookies.jwt
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
                if (err) throw err
                if(username !== info.username){
                    authorized = false
                }
            })
        }else{
            return res.json({status: 'failed', message: 'No token!', notes: null })
        }

        if(!authorized){
            return res.json({status: 'failed', message: 'You are not authorized to access this data', notes: null})
        }

        const userInfo = await User.findOne({username: username})
        if(!userInfo){
            return res.json({status: 'failed', message: 'user does not exist!'})
        }

        const userId = userInfo._id
        let notes = await Note.find({userId: userId})

        switch(sort){

            case 'Select an Sort Option':
                notes = notes.reverse()
                res.json({status: 'ok', notes: notes})
                break

            case 'Default':
                notes = notes.reverse()
                res.json({status: 'ok', notes: notes})
                break

            case 'Date':
                res.json({status: 'ok', notes: notes})
                break

            case 'Title':
                await notes.sort((a, b) => {
                    const titleA = a.title.toUpperCase();
                    const titleB = b.title.toUpperCase();

                    if (titleA < titleB) {
                      return -1;
                    }
                    if (titleA > titleB) {
                      return 1; 
                    }
                    return 0;
                  });

                res.json({status: 'ok', notes: notes})
                break

            default:

                let newNotes = []
                await notes.map((note) => {
                    if(note.subject === sort){
                        newNotes.push(note)
                    }
                })

                res.json({status: 'ok', notes: newNotes})

        }

    }catch(err){
        res.json({status: 'failed', message: err.message})
    }

}

const deleteNote = async (req, res) => {

    try{

        const noteId = req.params.noteId

        const note = await Note.findByIdAndDelete(noteId)

        if(note.notePicturePath !== 'notePictures/picture not founded.png'){
            const notePicturePath = `public/assets/${note.notePicturePath}`
            fs.unlink(`${notePicturePath}`, (err) => {
                if (err) {
                console.error('Error deleting the file:', err);
                }
            })
        }

        if(note.noteAudioPath !== ''){
            const noteAudioPath = `public/assets/${note.noteAudioPath}`
            fs.unlink(`${noteAudioPath}`, (err) => {
                if (err) {
                console.error('Error deleting the file:', err);
                }
            })
        }

        res.json({status: 'ok', message: 'Note has been deleted!'})

    }catch(err){
        res.json({status: 'failed', message: err.message})
    }

}

module.exports = {
    post1,
    post2,
    getNotes,
    deleteNote
}
