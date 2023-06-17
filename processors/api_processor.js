import { isMainThread, parentPort, threadId } from 'node:worker_threads';
import EndPointHandler from '../classes/end_point_handler.js';
import 'dotenv/config'
import saveResponse from '../utils/mongo_utils.js';
import PhraseCache from '../classes/phrase_cache.js';
import { getPhraseCache } from '../utils/mongo_utils.js';
import ReevItemSchema, { MongooseConnection, } from '../schemas/reev_item_schema.js';

process.on('uncaughtException', (err) => {
       console.error(`Uncaught exception in worker thread: ${err.stack}`);
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
      nextPageGetterName,
      schemaMapper,
      found,

    } = task;

    
    //properties set on every db item;
    const dbItemProps = {
      category: categoryName,
      sourceName: apiName,
      sourceUrl: baseUrl,
      sourceEndpoint: endPointName,
      searchPhrase: query,
    }

    //import api module
    const apiModule = await import(modulePath);
    const Api  = apiModule.default;
    

    //initialise cache
    const phraseCacheInstance = new PhraseCache(query, endPointName);

    //initialise api
    const apiInstance = new Api(apiKey, baseUrl, query);

    //initialise endpoint handler
    const endPointHandler = new EndPointHandler(apiInstance, endPointName, errorHandlerName, responseParserName, totalPagesGetterName, currentPageGetterName, responseListener, doneListener);

    //listen for responses from endpoint handler
    async function responseListener(response) {
      //save response to db;
      
      if(response) {
        const data = apiInstance[responseParserName](response);
        try{
          const {current_page, total_pages} = await saveResponse(data, ReevItemSchema, MongooseConnection, _idProps, dbItemProps, phraseCacheInstance, schemaMapper);
          if(current_page){
            //Check if there are more pages to get
            if(current_page <= total_pages){
              const nextPage = apiInstance[nextPageGetterName](response);
              endPointHandler.emit('saved', nextPage, total_pages);
            }
            else{
              //close the worker thread
              // parentPort.emit('done', 'completed sucessfully');
              // parentPort.close();
            }
                 
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
      //get cache of the request for a given phrase and endpoint
      const cache = await getPhraseCache(phraseCacheInstance, endPointName, apiName, query);
      const lastPageQueried = cache?.cachedPhrases.get(query).lastPageQueried || 0;
      console.log('lastPageQueried', lastPageQueried)
      const totalPages = cache?.cachedPhrases.get(query).totalPages || 5;
      console.log('totalPages', totalPages)
      if(lastPageQueried !== 'undefined'){
        await endPointHandler.handleRequestMethod(lastPageQueried + 1, totalPages);
      }

      else{
        await endPointHandler.handleRequestMethod(1, totalPages || 5);
      }
      
       
    } catch (error) {
      parentPort.postMessage({err: error.message});
      parentPort.close();
      throw error;
              
    }
  });

  
} else {
  console.log('This code is running in the main thread and will never get executed in a worker thread');
}

