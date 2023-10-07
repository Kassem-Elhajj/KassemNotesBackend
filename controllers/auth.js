const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const User = require('../models/userSchema')
const {handleRegisterErrors} = require('../handleErrors/handleAuthError')

const register = async (req, res) => {

    token = req.cookies.jwt
    if(token){
        return res.json({status: 'failed', message: 'You are already logged in'})
    }

    let picturePath = ''
    let {username, password, reenteredPassword, birthDate} = req.body
    let picture = req.file
    
    if(password !='' & password === reenteredPassword){
        
        try{

            if(password.length < 8){
                throw new Error("Password must be greater than 8 characters!")
            }

            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(password, salt)

            if(picture){
                picturePath = await req.file.path.slice(14) //slice so I only get the name of the picture
            }
        
            const response = await User.create({username, password: passwordHash, picturePath, birthDate})
            const userInfo = {username, picturePath, birthDate}
            const token = jwt.sign({id: response._id, username: username}, process.env.JWT_SECRET)
            res.cookie('jwt', token, { sameSite: 'None', secure: true })
            res.json({status: 'ok', userInfo: userInfo, message: 'account has been created!'})

        }catch(err){

            res.json({status: 'failed', message: handleRegisterErrors(err)})

            if (req.file) {
                fs.unlink(`${req.file.path}`, (err) => {
                  if (err) {
                    console.error('Error deleting the file:', err);
                  }
                })
            }
        }

    }else{

        res.json({status: 'failed', message: 'renentered password is wrong!'})

        if (req.file) {
            fs.unlink(`${req.file.path}`, (err) => {
              if (err) {
                console.error('Error deleting the file:', err);
              }
            })
        }
    }
}

const login = async (req, res) => {

    token = req.cookies.jwt
    if(token){
        return res.json({status: 'failed', message: 'You are already logged in'})
    }

    const {username, password} = req.body
    try{

        const user = await User.findOne({username: username})
        if(!user) return res.json({status: 'failed', message: 'username does not exist!'})

        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){

            const token = jwt.sign({id: user._id, username: username}, process.env.JWT_SECRET)
            res.cookie('jwt', token)
            return res.json({status: 'ok', message: `${username} has login to his account!`, token: token})

        }else{
            res.json({status: 'failed', message: 'Something went wrong, try again later!'})
        }

    }catch(err){
        res.json({status: 'failed', message: err.message})
    }

}

const profile = async (req, res) => {

    try{
        token = req.cookies.jwt
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
                if (err) throw err
                const response = await User.findById(info.id)
                user = {username :response.username, picturePath: response.picturePath, birthDate: response.birthDate}
                res.json({status: 'ok', user: user})
            })
        }else{
            res.json({status: 'failed', message: 'No token!', user: null })
        }

    }catch(err){
        res.json({status: 'failed', message: err.message, user: null})
    }

}

const logout = async (req, res) => {
    await res.cookie('jwt', '', { maxAge: 1 })
    res.json({ status: "ok", message: "removed jwt" })
}

module.exports = {
    register,
    login,
    profile,
    logout
}
