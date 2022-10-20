const { gql } = require("apollo-server-express");

// input inputBook {
//   _id: ID!
//   authors: [String]
//   description: String!
//   bookId: String!
//   image: String
//   link: String
//   title: String!
// }

const typeDefs = gql`
  type Book {
    _id: ID!
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Query {
    me: User
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: inputBook): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
