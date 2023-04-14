import { isMainThread, parentPort } from 'node:worker_threads';
import EndPointHandler from '../classes/end_point_handler.js';
import mongoose from 'mongoose';
import ReevItemSchema from '../schemas/reev_item_schema.js';
import 'dotenv/config'
import saveResponse from '../utils/mongo_utils.js';
import PhraseCache from '../classes/phrase_cache.js';
import { getPhraseCache } from '../utils/mongo_utils.js';

process.on('uncaughtException', (err) => {
       console.error(`Uncaught exception in worker thread: ${err}`);
       parentPort.postMessage(err);
});
 

if (!isMainThread) {
  parentPort.on('message', async (task) => {
    const {
      categoryName,
      apiName,
      modulePath,
      endPointName,
      apiKey,
      baseUrl,
      query,
      errorHandlerName,
      responseParserName,
      _idProps,
      totalPagesGetterName,
      currentPageGetterName
    } = task;

    
    //properties set on every db item;
    const dbItemProps = {
      category: categoryName,
      sourceName: apiName,
      sourceUrl: baseUrl,
      sourceEndpoint: endPointName,
      searchPhrase: query,
    }

    const apiModule = await import(modulePath);
    const Api  = apiModule.default;

    const mongooseConnection = mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 4,
    });
    const ReevItem  = mongooseConnection.model('ReevItem', ReevItemSchema);

    //initialise cache
    const phraseCacheInstance = new PhraseCache(query, endPointName);

    //initialise api
    const apiInstance = new Api(apiKey, baseUrl, query);

    //initialise endpoint handler
    const endPointHandler = new EndPointHandler(apiInstance, endPointName, errorHandlerName, responseParserName, totalPagesGetterName, currentPageGetterName, responseListener, doneListener);

    //listen for requests
    endPointHandler.on('data', async(data) => {
      await responseListener(data)
    });

    endPointHandler.once('done', ()=>{
      doneListener();
    })


    async function responseListener(data) {
      //save response to db;
      
      if(data) {
        try{
          await saveResponse(data, ReevItem, _idProps, dbItemProps, phraseCacheInstance);

        }
        catch(error){
          
         throw error;
        }
    } 
  }
    
    function doneListener(){
      parentPort.postMessage('completed sucessfully');
      parentPort.close();
    }
    try {
      //get cache
      const cache = await getPhraseCache(phraseCacheInstance, endPointName, apiName, query);
      const lastPageQueried = cache.cachedPhrases.get(query).lastPageQueried;
      await endPointHandler.handleRequestMethod(lastPageQueried + 1);
       
    } catch (error) {
      parentPort.postMessage({err: error.message});
      throw error;        
    }
  });

  
} else {
  console.log('This code is running in the main thread');
}

