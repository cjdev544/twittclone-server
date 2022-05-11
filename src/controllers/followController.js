const Follow = require('../models/follow')
const User = require('../models/user')

const followController = {
  /**********************************************************
   *  Follow user
   **********************************************************/
  followUser: async (username, user) => {
    try {
      const userExist = await User.findOne({ username })

      if (!userExist) throw new Error('Usuario no encontrado')

      const newFollow = new Follow({
        userId: user.id,
        followId: userExist.id,
      })

      await newFollow.save()

      return true
    } catch (err) {
      console.log(err)
      return false
    }
  },

  /**********************************************************
   *  UnFollow user
   **********************************************************/
  unFollowUser: async (username, user) => {
    try {
      const userExist = await User.findOne({ username })

      if (!userExist) throw new Error('Usuario no encontrado')

      const follow = await Follow.find({ userId: user.id })
        .where('followId')
        .equals(userExist?.id)

      await Follow.findByIdAndDelete(follow[0].id)

      return true
    } catch (err) {
      console.log(err)
      return false
    }
  },

  /**********************************************************
   *  Follow o no follow user
   **********************************************************/
  followNoFollow: async (username, user) => {
    try {
      const userExist = await User.findOne({ username })

      if (!userExist) throw new Error('Usuario no encontrado')

      const follow = await Follow.find({ followId: userExist.id })
        .where('userId')
        .equals(user.id)

      if (follow?.length) return true
      return false
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**********************************************************
   *  Followeds users
   **********************************************************/
  getFolloweds: async (username) => {
    try {
      const userExist = await User.findOne({ username })

      if (!userExist) throw new Error('Usuario no encontrado')

      const followeds = await Follow.find({ userId: userExist.id }).populate(
        'followId'
      )
      const followFormat = followeds?.map((follow) => ({
        id: follow.followId.id,
        name: follow.followId.name,
        lastname: follow.followId.lastname,
        username: follow.followId.username,
        avatar: follow.followId.avatar,
      }))

      return followFormat
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**********************************************************
   *  Followers users
   **********************************************************/
  getFollowers: async (username) => {
    try {
      const userExist = await User.findOne({ username })

      if (!userExist) throw new Error('Usuario no encontrado')

      const followers = await Follow.find({ followId: userExist.id }).populate(
        'userId'
      )
      const followFormat = followers?.map((follow) => ({
        id: follow.userId.id,
        name: follow.userId.name,
        lastname: follow.userId.lastname,
        username: follow.userId.username,
        avatar: follow.userId.avatar,
      }))

      return followFormat
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**********************************************************
   *  No followeds users
   **********************************************************/
  getNoFolloweds: async (user) => {
    try {
      const users = await User.find().limit(100)

      const arrayUsers = []
      for await (const userFind of users) {
        const isNoFollowed = await Follow.findOne({ userId: user.id })
          .where('follow')
          .equals(userFind.id)

        if (!isNoFollowed) {
          if (user.id.toString() !== userFind.id.toString()) {
            arrayUsers.push(userFind)
          }
        }
      }
      return arrayUsers
    } catch (err) {
      console.log(err)
      return err
    }
  },
}

module.exports = followController
