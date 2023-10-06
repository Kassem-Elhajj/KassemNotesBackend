const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/assets/profilePictures')
    },
    filename : function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const uploadProfilePicture = multer({ storage: storage });

const pictureNoteStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/assets/notePictures')
    },
    filename : function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const uploadPictureNote = multer({ storage: pictureNoteStorage });

const audioNoteStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/assets/noteAudio')
    },
    filename : function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const uploadAudioNote = multer({ storage: audioNoteStorage });

module.exports = {
    uploadProfilePicture,
    uploadPictureNote,
    uploadAudioNote
}