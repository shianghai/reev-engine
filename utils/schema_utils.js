/**
 * Extract the schema @param data from the data using the @param schemaMapper
 * @param {Object} data The data which needs to be parsed to the corresponding schema
 * @param {object[]} schemaMapper The array of key-value pairs where the key is the property name of the schema and the value being the property name of the item in the data
 */
export function GetSchemaData(data, schemaMapper){
    let newDataObj = {};
    schemaMapper.forEach(schemaPropObject  => {               
        const schemaKey = Object.keys(schemaPropObject)[0];
        let schemaValue;
        let dataKey = schemaPropObject[schemaKey]
        if(Array.isArray(dataKey)){
            var value = dataKey.reduce((acc, curr)=>{
                if(acc === null) return null
                if (Array.isArray(acc)) return acc[0][curr]
                if (!(curr in acc)) return null
                return acc[curr];
            }, data);
            schemaValue = value
        }
        else{
            schemaValue = data[dataKey]
        }
        if(!schemaValue){
            Object.assign(newDataObj, {[schemaKey]: null})
        }
        else{
            Object.assign(newDataObj, {[schemaKey]: schemaValue})
        }        
    });
    return newDataObj;
}