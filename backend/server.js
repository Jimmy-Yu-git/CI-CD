import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db.js';
import mongo from './mongo.js';
import Query from './resolver/Query.js'
import Subscription from './resolver/subscribe.js';
import ChatBox from './resolver/Chatbox.js';
import Message from './resolver/Message.js';
import Mutation from './resolver/Mutation.js'
const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers: {
    Query,
    Mutation,
    ChatBox,
    Message,
    Subscription,
    // User,
    // Post,
    // Comment,
  },
  context: {
    db,
    pubsub,
  },
});
mongo.connect();
server.start({ port: process.env.PORT | 5000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 5000}!`);
});
