


const handleRegisterErrors = (err, password) => {

    const codeError = err.code
    if(codeError === 11000){
        return 'Username is not valid!'
    }

    let message = ''
    if(err.message.includes('User validation failed')){
        error = err.message.slice(24)
        const indexOfSeparator = error.indexOf(':')
        message = error.slice(indexOfSeparator + 2)
    }else{
        message = err.message
    }

    return message
}

module.exports = {
    handleRegisterErrors
}