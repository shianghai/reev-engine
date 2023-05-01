import { isMainThread, parentPort, threadId } from 'node:worker_threads';
import EndPointHandler from '../classes/end_point_handler.js';
import 'dotenv/config'
import saveResponse from '../utils/mongo_utils.js';
import PhraseCache from '../classes/phrase_cache.js';
import { getPhraseCache } from '../utils/mongo_utils.js';
import ReevItemSchema, { MongooseConnection, } from '../schemas/reev_item_schema.js';

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
      currentPageGetterName,
      schemaMapper
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
    

    //initialise cache
    const phraseCacheInstance = new PhraseCache(query, endPointName);

    //initialise api
    const apiInstance = new Api(apiKey, baseUrl, query);

    //initialise endpoint handler
    const endPointHandler = new EndPointHandler(apiInstance, endPointName, errorHandlerName, responseParserName, totalPagesGetterName, currentPageGetterName, schemaMapper, responseListener, doneListener);

    //listen for requests
   
    async function responseListener(data) {
      //save response to db;
      
      if(data) {
        try{
          const {current_page, total_pages} = await saveResponse(data, ReevItemSchema, MongooseConnection, _idProps, dbItemProps, phraseCacheInstance);
          if(current_page){
            //might create specific saving status codes to be handled by the 'saved' event handler
            endPointHandler.emit('saved', current_page, total_pages)
          }
        }
        catch(error){
          console.log('error', error)
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
      const lastPageQueried = cache?.cachedPhrases.get(query).lastPageQueried;
      const totalPages = cache?.cachedPhrases.get(query).totalPages || 5;
      if(lastPageQueried !== undefined){
        await endPointHandler.handleRequestMethod(lastPageQueried + 1, totalPages);
      }

      else{
        await endPointHandler.handleRequestMethod(1, totalPages);
      }
      
       
    } catch (error) {
      parentPort.postMessage({err: error.message});
      parentPort.close();
      throw error;
              
    }
  });

  
} else {
  console.log('This code is running in the main thread');
}

