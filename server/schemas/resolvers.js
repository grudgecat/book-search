const { User } = require('../models');

const {signToken} = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      return User.findOne({ _id: context.user._id });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No User with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      const user = await User.findOneAndUpdate( {_id:context.user._id},{$push:{savedBooks:args}});
      return user;
    },
    removeBook: async (parent, { bookId }, context) => {
      const user = await User.findOneAndUpdate({_id:context.user._id}, {$pull:{savedBooks:{bookId:bookId}}});
      return user;
    }
  },

};

module.exports = resolvers;
