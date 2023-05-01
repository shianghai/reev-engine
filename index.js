import WorkerPool from "./classes/worker_pool.js";
import os from 'node:os';
import CategoryList from "./data/categories_list.js";


const query = 'john wick';
//const numThreads = os.availableParallelism();


const apiWorkerPools = {};


for (const category of CategoryList) {
  for(const api of category.apiList){
    const numThreads = api.endPointNames.length < os.cpus().length ? api.endPointNames.length : os.cpus().length;
    apiWorkerPools[api.name] = new WorkerPool(numThreads, '../processors/api_processor.js');
    
  }
}


// // Initialize the counter
// let closedPools = 0;

// // Loop through the worker pools and close them
// for (const pool of Object.values(apiWorkerPools)) {
//   pool.on('done', () => {
//     console.log(`pool ${pool} done `)
//     pool.close();
//     closedPools++;

//     // Check if all the pools have been closed
//     if (closedPools === Object.values(apiWorkerPools).length) {
//       console.log("all tasks completed")
//       // Terminate the process
//       process.exit();
//     }
//   });
// }


for (const category of CategoryList) {

  const categoryName = category.name;

  for (const api of category.apiList) {

    const apiName = api.name;

    const pool = apiWorkerPools[apiName];

    const modulePath = api.modulePath;

    const apiKey = api.apiKey;

    const baseUrl = api.baseUrl;

    const errorHandlerName = api.errorHandlerName;

    const responseParserName = api.responseParserName;

    const _idProps = api._idProps;
    
    const totalPagesGetterName = api.totalPagesGetterName;

    const currentPageGetterName = api.currentPageGetterName;
    const schemaMapper = api.schemaMapper;
  
    for(const endPointName of api.endPointNames){
      const task = {
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
      }



      pool.runTask(task, (err, result) => {
        if (err) {
          console.error(`Error processing task: ${err}`);
        } else {
          console.log(`\n Result for task ${JSON.stringify(task)}: ${JSON.stringify(result)}`);
          //process.exit(0)
        }
      });
    }    
  }
}




