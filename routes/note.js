const express = require('express')

const { uploadPictureNote, uploadAudioNote } = require('../controllers/multerController')
const {post1, post2, getNotes, deleteNote} = require('../controllers/note')
const { validateUser } = require('../middleware/auth')

const router = express.Router()

router.post('/post1/:username',validateUser, uploadPictureNote.single('picture'), post1)
router.post('/post2/:noteId', uploadAudioNote.single('audio'), post2)

router.get('/getNotes/:username/:sort', getNotes)
router.delete('/deleteNote/:noteId', deleteNote)




module.exports = router