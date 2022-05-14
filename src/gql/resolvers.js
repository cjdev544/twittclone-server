const { GraphQLUpload } = require('graphql-upload')

const userController = require('../controllers/userController')
const followController = require('../controllers/followController')
const twittController = require('../controllers/twittControlloer')

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    // User ***********************************************
    getUser: (_, { username, id }) => userController.getUser(username, id),

    // Follow *********************************************
    followNoFollow: (_, { username }, ctx) =>
      followController.followNoFollow(username, ctx.user),

    getFolloweds: (_, { username }, ctx) =>
      followController.getFolloweds(username, ctx.user),

    getFollowers: (_, { username }, ctx) =>
      followController.getFollowers(username, ctx.user),

    getNoFolloweds: (_, {}, ctx) => followController.getNoFolloweds(ctx.user),

    // Twitts *********************************************
    getUserTwitts: (_, { username }) => twittController.getUserTwitts(username),
  },

  Mutation: {
    // User ***********************************************
    createUser: (_, { input }) => userController.createUser(input),

    loginUser: (_, { input }) => userController.loginUser(input),

    uploadBanner: (_, { file }, ctx) =>
      userController.uploadBanner(file, ctx.user),

    uploadAvatar: (_, { file }, ctx) =>
      userController.uploadAvatar(file, ctx.user),

    updateUser: (_, { input }, ctx) =>
      userController.updateUser(input, ctx.user),

    // Follow *********************************************
    followUser: (_, { username }, ctx) =>
      followController.followUser(username, ctx.user),

    unFollowUser: (_, { username }, ctx) =>
      followController.unFollowUser(username, ctx.user),

    // Twitts *********************************************
    createTwitt: (_, { message }, ctx) =>
      twittController.createTwitt(message, ctx.user),
  },
}

module.exports = resolvers
