export const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!]
  }

  type Review {
    id: ID!
    rating: Int!
    content: String!
    author: Author!
    game: Game!
  }

  type Author {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!]
  }

  type Query {
    games(filter: GameFilterInput, sortBy: GameSortByInput): [Game]
    game(id: ID!): Game
    reviews: [Review]
    review(id: ID!): Review
    authors: [Author]
    author(id: ID!): Author
  }

  input GameFilterInput {
    platform: [String!]
  }

  enum GameSortByInput {
    TITLE_ASC
    TITLE_DESC
  }

  type Mutation {
    addGame(game: AddGameInput!): Game
    deleteGame(id: ID!): [Game]
    updateGame(id: ID!, edits: EditGameInput): Game
  }

  input AddGameInput {
    title: String!
    platform: [String!]!
  }

  input EditGameInput {
    title: String
    platform: [String!]
  }
`;
