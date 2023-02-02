const bcrypt = require('bcrypt')

exports.hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (error, salt) => {
            if (error) reject(error);
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) reject(error)
                resolve(hash)
            })
        })
    })
}

exports.comparePassword = (password, hashed) => {
    console.log("Password ", password)
    console.log("Hashed ", hashed)
    return bcrypt.compare(password, hashed)
}