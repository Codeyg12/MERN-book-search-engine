const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const myData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return myData;
      }
      throw new AuthenticationError("Log in to see your saved books");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      const correctPw = await user.isCorrectPassword(password);

      if (!user || !correctPw) {
        throw new AuthenticationError("Invalid email or password");
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        //?? Is bookId args.input correct??
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: { bookId: args.input } } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in to save books");
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        return Book.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to login to delete books");
    },
  },
};

module.exports = resolvers;