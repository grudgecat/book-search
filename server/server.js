const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require("./utils/auth.js");

const jwt = require('jsonwebtoken');
const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:   async  ({ req }) => {
      let token = req.body.token || req.query.token || req.headers.authorization;
  
      if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
      }
  
      if (!token) {
        return req;
      }
      console.log(token);
      try {
        const { data } = await jwt.verify(token, secret, { maxAge: expiration });
        req.user = data;
      } catch {
        console.log('Invalid token');
      }
  
      return req;
    }
  });
  await server.start();
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

};
startServer()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
};

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);

  });
});

