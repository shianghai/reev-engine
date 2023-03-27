import { isMainThread, parentPort } from 'node:worker_threads';
import EndPointHandler from '../classes/end_point_handler.js';

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
      responseParserName
    } = task;

    const module = await import(modulePath);

    const Api = module.default;

    const apiInstance = new Api(apiKey, baseUrl, query);

    function responseListener(data) {
      //save response to db;
      console.log('data received');
      parentPort.postMessage(data);
    }

    function notFoundListener(){
       parentPort.postMessage('not found');
    }
    //initialise endpoint handler
    const endPointHandler = new EndPointHandler(apiInstance, endPointName, errorHandlerName, responseParserName, responseListener, notFoundListener);

    //listen for requests
    endPointHandler.on('data', (data) => {
      responseListener(data)
    });

    endPointHandler.on('not found', ()=>{
       notFoundListener();
    })

    try {
      await endPointHandler.handleRequestMethod();
    } catch (error) {
       parentPort.postMessage({ error: error.message });
    }
  });
} else {
  console.log('This code is running in the main thread');
}
