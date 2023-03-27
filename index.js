import WorkerPool from "./classes/worker_pool.js";
import os from 'node:os';
import CategoryList from "./data/categories_list.js";


const query = 'john wick';
const numThreads = os.cpus().length


const apiWorkerPools = {};


for (const category of CategoryList) {
  //apiWorkerPools[category.name] = new WorkerPool(numThreads, '../processors/category_processor.js');
  for(const api of category.apiList){
    apiWorkerPools[api.name] = new WorkerPool(numThreads, '../processors/api_processor.js')
  }
}


for(const pool of Object.values(apiWorkerPools)){
    pool.on('done', ()=>{
        pool.close();
    })
}

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
  
    for(const endPointName of api.endPointNames){
      const task = {categoryName, apiName, modulePath, endPointName, apiKey, baseUrl, query, errorHandlerName, responseParserName}

      pool.runTask(task, (err, result) => {
        if (err) {
          console.error(`Error processing task: ${err}`);
        } else {
          console.log(`Result for task ${JSON.stringify(task)}: ${JSON.stringify(result)}`);
        }
      });
    }    
  }
}




