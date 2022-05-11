const jwt = require('jsonwebtoken')

const createToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    username: user.username,
    birthdayDate: user.birthdayDate || null,
    email: user.email,
    avatar: user.avatar || null,
    banner: user.banner || null,
    website: user.website || null,
    ubication: user.ubication || null,
    createAt: user.createAt,
  }
  const token = jwt.sign(payload, process.env.SECRET_WORD)
  return token
}

module.exports = createToken
