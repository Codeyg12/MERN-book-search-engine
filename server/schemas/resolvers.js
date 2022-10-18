const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async (parent, args) => {
      return User.findOne({ email: args.email });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const myData = await User.findOne({ _id: context.user }).select(
          "-__v -password"
        );
        return myData;
      }
      throw new AuthenticationError("Log in to see your saved books");
    },
  },
};

module.exports = resolvers;
