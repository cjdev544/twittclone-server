const Twitt = require('../models/twitts')
const User = require('../models/user')

const twittController = {
  /**********************************************************
   *  Craete twitt
   **********************************************************/
  createTwitt: async (message, user) => {
    try {
      const newTwitt = new Twitt({
        userId: user.id,
        message,
      })

      await newTwitt.save()
      return newTwitt
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**********************************************************
   *  Get user twitts
   **********************************************************/
  getUserTwitts: async (username) => {
    try {
      const userExist = await User.findOne({ username })

      if (!userExist) throw new Error('Usuario no encontrado')

      const twittsUser = await Twitt.find({ userId: userExist.id }).sort({
        createAt: -1,
      })

      return twittsUser
    } catch (err) {
      console.log(err)
      return err
    }
  },
}

module.exports = twittController
