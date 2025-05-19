const crypto = require('crypto')

const secreteKey = crypto.randomBytes(64).toString('hex')
console.log(secreteKey)