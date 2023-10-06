const express = require('express')

const { uploadProfilePicture } = require("../controllers/multerController")
const {login, profile, logout} = require('../controllers/auth')
const { register } = require('../controllers/auth')

const router = express.Router()

//auth API's
router.post('/register', uploadProfilePicture.single('picture'), register)
router.post('/login', login)
router.get('/profile', profile)
router.delete('/logout', logout)


module.exports = router