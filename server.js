import express from "express";
import { ApolloServer, PubSub } from "apollo-server-express";
import { importSchema } from "graphql-import";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import "dotenv-defaults/config.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Query from './backend/resolver/Query.js'
import Mutation from './backend//resolver/Mutation.js'
import Subscription from './backend/resolver/subscribe.js';
import ChatBox from './backend/resolver/Chatbox.js';
import Message from './backend/resolver/Message.js';
import mongo from './backend/mongo.js';
import db from "./backend/db.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 80;
const typeDefs = importSchema('./backend/schema.graphql')
const pubsub = new PubSub();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
      ChatBox ,
      Message,
      Mutation,
      Subscription,
    },
    context: {
      db,
      pubsub,
    },
  });
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

mongo.connect();

httpServer.listen(port,() => {
    console.log(`🚀 Server Ready at ${port}! 🚀`);
    console.log(`Graphql Port at ${port}${server.subscriptionsPath}`);
});