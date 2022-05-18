const Twitt = require('../models/twitts')
const User = require('../models/user')
const Follow = require('../models/follow')

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

  getAllFollowedsTwitts: async (user) => {
    try {
      const followeds = await Follow.find({ userId: user.id })

      if (followeds?.length === 0) {
        const twitts = await Twitt.find().sort({ createAt: -1 }).limit(300)
        return twitts
      }

      const twittsFolloweds = []
      for await (const followed of followeds) {
        const followedTwitts = await Twitt.find({
          userId: followed.followId,
        }).limit(100)
        if (followedTwitts.length > 0) twittsFolloweds.push(...followedTwitts)
      }

      const authTwitts = await Twitt.find({ userId: user.id }).limit(100)
      if (authTwitts.length > 0) twittsFolloweds.push(...authTwitts)

      if (twittsFolloweds.length === 0) return []

      const sortTwitts = twittsFolloweds.sort((a, b) => b.createAt - a.createAt)

      return sortTwitts
    } catch (err) {
      console.log(err)
      return err
    }
  },
}

module.exports = twittController
