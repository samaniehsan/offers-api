import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import logger from './logger'
import morgan from 'morgan';
import { ApolloServer, gql } from 'apollo-server-express';
import { SearchService } from './search-service';

// Init express
const app = express();

app.use(morgan('dev'));

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});

app.get('/api/test', (req: Request, res: Response) => {
    res.set('Content-Type', 'application/json')
    res.json({name: 'Test 1'});
});


const offerTypeDef = `
type Offer {
    id: String!
    offerVendorBrand: String
    offerLogoVendorSquare: String
    offerHeaderLong: String
    offerDestinationUrl: String
  }
`;

const queryTypeDef = `
type Query {
    search(term: String): [Offer]
  }
`
const typeDefs = gql` ${offerTypeDef} ${queryTypeDef}`;

const resolvers = {
  Query: {
    search: async(root:any, args:{term:string}) => {
        logger.debug(`search result root:${JSON.stringify(root)} args:${JSON.stringify(args)}`);
        if(!args.term) {
          return null;
        }
        const searchService = new SearchService();
        const results = await searchService.findOffers(args.term);
        return results;
    },
  },
};

const server = new ApolloServer({
    // These will be defined for both new or existing servers
    typeDefs,
    resolvers,
    //tracing: true,
  });

server.applyMiddleware({ app, path: '/api/search' });

// Export express instance
export default app;
