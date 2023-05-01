/**
 * 
 * @param {Array | Object} data The data which needs to be parsed to the corresponding schema
 * @param {*} schemaMapper The array of key-value pairs where the key is the property name of the schema and the value being the property name of the item in the data
 */
export function GetSchemaData(data, schemaMapper){
    let result = [];
    if(typeof data === 'object'){

    }

    if(Array.isArray(data)){
        data.map((dataObject, index)=>{
            let newDataObj = {};
            schemaMapper.forEach(schemaPropObject  => {
                
                const schemaKey = Object.keys(schemaPropObject)[0];
                const schemaValue = dataObject[schemaPropObject[schemaKey]];
                if(!schemaValue){
                    Object.assign(newDataObj, {[schemaKey]: null})
                }
                else{
                    Object.assign(newDataObj, {[schemaKey]: schemaValue})
                }
                
               
            });
            
            result.push(newDataObj);
        });
    }
    
    return result;
    
}