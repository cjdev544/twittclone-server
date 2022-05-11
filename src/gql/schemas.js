const { gql } = require('apollo-server-express')

const typeDefs = gql`
  # *******************************************************
  # TYPES
  # *******************************************************
  scalar Upload # Upload files type scalar
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  # Types User ********************************************
  type User {
    id: ID
    name: String
    lastname: String
    username: String
    email: String
    password: String
    biography: String
    avatar: String
    banner: String
    website: String
    ubication: String
    createAt: String
  }

  type UploadUser {
    user: User
    token: String
  }

  # *******************************************************
  # INPUTS
  # *******************************************************

  # Inputs User *******************************************
  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateInput {
    name: String!
    lastname: String!
    biography: String
    website: String
    ubication: String
  }

  # *******************************************************
  # QUERIES
  # *******************************************************
  type Query {
    # User ************************************************
    getUser(username: String, id: ID): User

    # Follow **********************************************
    followNoFollow(username: String!): Boolean
    getFolloweds(username: String!): [User]
    getFollowers(username: String!): [User]
    getNoFolloweds: [User]
  }

  # *******************************************************
  # MUTATIONS
  # *******************************************************
  type Mutation {
    # User ************************************************
    createUser(input: UserInput): User
    loginUser(input: LoginInput): String
    uploadBanner(file: Upload!): UploadUser
    uploadAvatar(file: Upload!): UploadUser
    updateUser(input: UpdateInput): UploadUser

    # Follow **********************************************
    followUser(username: String!): Boolean
    unFollowUser(username: String!): Boolean
  }
`

module.exports = typeDefs
