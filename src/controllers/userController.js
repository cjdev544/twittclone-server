const bcrypt = require('bcrypt')
const { customAlphabet } = require('nanoid')
const validator = require('validator')

const User = require('../models/user')
const cloudinaryUploadImg = require('../utils/cloudinaryUploadImg')
const createToken = require('../utils/createToken')

const userController = {
  /**********************************************************
   *  Craete a User
   **********************************************************/
  createUser: async (input) => {
    const { email, password } = input
    const formatEmail = email.toLowerCase().trim()
    const formatPassword = password.trim()

    try {
      if (!validator.isEmail(formatEmail))
        throw new Error('Introduce un correo valido')

      const emailExist = await User.findOne({ email: formatEmail })

      if (emailExist) throw new Error('El correo ya se encuentra registrado')

      if (formatPassword.length < 6)
        throw new Error('La contraseña debe tener al menos 6 caracteres')

      // Create a username unique in database
      let username = formatEmail.split('@')[0]
      let usernameExist
      let i = 0
      do {
        if (i === 0) {
          usernameExist = await User.findOne({ username })
        } else {
          const nanoid = customAlphabet('0123456789', 2)
          const concat = nanoid()
          usernameExist = await User.findOne({ username: username + concat })
          username = username + concat
        }
        i++
      } while (usernameExist)

      // Encript password
      const hashPassword = await bcrypt.hash(formatPassword, 10)

      const newUser = new User(input)
      newUser.email = formatEmail
      newUser.password = hashPassword
      newUser.username = username

      await newUser.save()
      return newUser
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**********************************************************
   *  Login User
   **********************************************************/
  loginUser: async (input) => {
    const { email, password } = input

    const formatEmail = email.toLowerCase().trim()
    const formatPassword = password.trim()

    try {
      if (!validator.isEmail(formatEmail))
        throw new Error('Introduce un correo valido')

      const userExist = await User.findOne({ email: formatEmail })

      if (!userExist) throw new Error('Correo no registrado')

      const checkPassword = await bcrypt.compare(
        formatPassword,
        userExist.password
      )

      if (!checkPassword) throw new Error('Correo o contraseña invalida')

      const token = createToken(userExist)

      return token
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**********************************************************
   *  Get User
   **********************************************************/
  getUser: async (username, id) => {
    let userExist

    try {
      if (id) {
        userExist = await User.findById(id)
      } else {
        userExist = await User.findOne({ username })
      }
      if (!userExist) throw new Error('Usuario no encontrado')

      return userExist
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**********************************************************
   *  Upload Banner
   **********************************************************/
  uploadBanner: async (file, user) => {
    console.log('BANNER', file)
    try {
      const res = await cloudinaryUploadImg(file, 'twettclone/banner', user.id)
      const dataUserUpdate = await User.findByIdAndUpdate(
        user.id,
        { banner: res.secure_url },
        { new: true }
      )

      const token = createToken(dataUserUpdate)

      return { user: dataUserUpdate, token }
    } catch (err) {
      return {
        ok: false,
        msg: 'Error al cargar el banner',
      }
    }
  },

  /**********************************************************
   *  Upload Avatar
   **********************************************************/
  uploadAvatar: async (file, user) => {
    try {
      const res = await cloudinaryUploadImg(file, 'twettclone/avatar', user.id)

      const dataUserUpdate = await User.findByIdAndUpdate(
        user.id,
        { avatar: res.secure_url },
        { new: true }
      )

      const token = createToken(dataUserUpdate)

      return { user: dataUserUpdate, token }
    } catch (err) {
      return {
        ok: false,
        msg: 'Error al cargar el avatar',
      }
    }
  },

  /**********************************************************
   *  Update User
   **********************************************************/
  updateUser: async (input, user) => {
    const newValue = {
      name: input.name,
      lastname: input.lastname,
      biography: input.biography,
      ubication: input.ubication,
      website: input.website,
    }

    try {
      // Search if user exist
      const { id } = user
      const userExist = await User.findById(id)

      if (!userExist) return new Error('Usuario no encontrado')

      const dataUserUpdate = await User.findByIdAndUpdate(
        id,
        { ...newValue },
        { new: true }
      )

      const token = createToken(dataUserUpdate)

      return { user: dataUserUpdate, token }
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**********************************************************
   *  Search Users
   **********************************************************/
  searchUsers: async (search) => {
    try {
      const users = await User.find({
        name: { $regex: search, $options: 'i' },
      })
      return users
    } catch (err) {
      return err
    }
  },
}

module.exports = userController
