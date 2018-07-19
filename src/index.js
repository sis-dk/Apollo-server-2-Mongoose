/* @flow */
/* eslint-disable no-unused-vars */

import { ApolloServer } from 'apollo-server';
import { schema } from './schema';

const PORT = 4000;

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
