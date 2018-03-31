import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import DataLoader from 'dataloader';
import { fetchPlayers } from './utils/nba-api';
import typeDefs from './src/graphql/schema';
import resolvers from './src/graphql/resolvers';
import pubsub from './src/graphql/subscriptions';

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();

app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      pubsub,
      playerLoader: new DataLoader(
        async () => {
          const players = await fetchPlayers();
          return [players];
        },
        { batch: false }
      ),
    },
  })
);

// Deploying
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:5000/subscriptions',
  })
);

const graphQLServer = createServer(app);

graphQLServer.listen('5000', () => {
  console.log('GraphQL Server is now running on http://localhost:5000/graphql');
  console.log(
    'GraphQL Subscriptions are now running on ws://localhost:5000/subscriptions'
  );

  const plays = [];

  setInterval(() => {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    plays.push({
      eventnum: plays.length,
      homedescription: text,
    });

    pubsub.publish('newPlay', { plays });
  }, 1500);
});

// eslint-disable-next-line no-unused-vars
const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: graphQLServer,
    path: '/subscriptions',
  }
);
