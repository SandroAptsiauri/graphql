import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./_db";
import { typeDefs } from "../schema";

interface Context {
  isVerified: boolean;
}

const resolvers = {
  Query: {
    games(_: any, { filter, sortBy }: any) {
      let games = db.games;

      if (filter?.platform) {
        games = games.filter((game) =>
          game.platform.some((p) => filter.platform.includes(p))
        );
      }

      if (sortBy === "TITLE_ASC") {
        games = games.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "TITLE_DESC") {
        games = games.sort((a, b) => b.title.localeCompare(a.title));
      }

      return games;
    },
    game(_: any, { id }: { id: string }) {
      return db.games.find((game) => game.id === id);
    },
    authors() {
      return db.authors;
    },
    author(_: any, { id }: { id: string }) {
      return db.authors.find((author) => author.id === id);
    },
    reviews() {
      return db.reviews;
    },
    review(_: any, { id }: { id: string }) {
      return db.reviews.find((review) => review.id === id);
    },
  },

  Game: {
    reviews(parent: any) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },

  Review: {
    author(parent: any) {
      return db.authors.find((a) => a.id === parent.author_id);
    },
    game(parent: any) {
      return db.games.find((g) => g.id === parent.game_id);
    },
  },

  Author: {
    reviews(parent: any) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },

  Mutation: {
    addGame(_: any, { game }: any, context: Context) {
      if (!context.isVerified) {
        throw new Error("Unauthorized: Only verified authors can add games.");
      }

      const newGame = {
        ...game,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.games.push(newGame);
      return newGame;
    },
    deleteGame(_: any, { id }: { id: string }, context: Context) {
      if (!context.isVerified) {
        throw new Error("Unauthorized: Only verified authors can delete games.");
      }

      db.games = db.games.filter((g) => g.id !== id);
      return db.games;
    },
    updateGame(_: any, { id, edits }: any, context: Context) {
      if (!context.isVerified) {
        throw new Error("Unauthorized: Only verified authors can update games.");
      }

      db.games = db.games.map((g) => (g.id === id ? { ...g, ...edits } : g));
      return db.games.find((g) => g.id === id);
    },
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    const isVerified = token === "verified-token";
    return { isVerified };
  },
});

console.log(`Server ready at: ${url}`);
