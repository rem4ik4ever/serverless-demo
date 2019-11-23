const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Query {
    hello: String
    bye: String
    allAuthors: [Author!]
    author(id: Int!): Author
    authorByName(name: String!): Author
  }
  type Author {
    id: ID!
    name: String!
    married: Boolean!
  }
`;

const authors = [
  { id: 1, name: "Terry Pratchett", married: false },
  { id: 2, name: "Stephen King", married: true },
  { id: 3, name: "JK Rowling", married: false },
  { id: 4, name: "Rem Kim", married: true }
];

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return "Hello, world!";
    },
    bye: (root, args, context) => {
      return "Bye, world2!";
    },
    allAuthors: (root, args, context) => {
      return authors;
    },
    author: (root, args, context) => {
      return;
    },
    authorByName: (root, args, context) => {
      console.log("hihhihi", args.name);
      return authors.find(x => x.name === args.name) || "NOTFOUND";
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();
