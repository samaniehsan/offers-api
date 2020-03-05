import {MongoClient, Collection, Cursor, FindOneOptions} from 'mongodb';
import { Offer } from './offer';
import logger from './logger';

export class SearchService {

    get connectionString(): string {
        if(!process.env.MONGO_DATABASE_CONNECTION) {
            logger.error(`cannot find environment variable:MONGO_DATABASE_CONNECTION`);    
        }
        const uri = `${process.env.MONGO_DATABASE_CONNECTION}`;
        return uri;
    }

    
    get databaseName(): string {
        if(!process.env.MONGO_DATABASE_NAME) {
            logger.error(`cannot find environment variable:MONGO_DATABASE_NAME`);    
        }
        const dbName = `${process.env.MONGO_DATABASE_NAME}`;
        return dbName;
    }

    async findOffers(term: string): Promise<Offer[]> {
        let offerSearchResult: Offer[] = [];
        const client = await MongoClient.connect(
            this.connectionString, 
            { 
                useNewUrlParser: true, 
                useUnifiedTopology: true 
            })
            .catch(err => { 
                logger.error(err);
             });
    
        if (!client) {
            throw new Error("Cannot Connect to Database");
        }
    
        try {
    
            const db = client.db(this.databaseName);
    
            const offerCollection = db.collection('offers');
            
            await offerCollection.createIndex( { 
                off_vendor_brand: "text", 
                off_header_long: "text" 
            }).catch(err => { 
                logger.error(`Failed Creating Index ${err}`);
             });

             logger.debug(`search for ${term}`);
            const rawDocuments = offerCollection.find(
                { $text: { $search: term } },
                {timeout : false}      
            ).project({ score: { $meta: "textScore" } }).
            sort( { score: { $meta: "textScore" } } );

            while (!rawDocuments.isClosed() && await rawDocuments.hasNext()) {
                logger.debug(`reading next curosr for search term:${term}`);
                const rawDocument = await rawDocuments.next();
                if(!rawDocument)
                    break;
                var offer = new Offer(
                    rawDocument._id,
                    rawDocument.off_vendor_brand,
                    rawDocument.off_logo_vendor_square,
                    rawDocument.off_header_long,
                    rawDocument.off_destination_url);
                offerSearchResult.push(offer);
             }

        } catch (err) {
            logger.error(err);
        } finally {
            client ? client.close() : null;
        }   
        return offerSearchResult;
    }
}
