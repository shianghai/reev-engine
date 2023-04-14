import mongoose from "mongoose";
import { MovieSchema } from "./category_schemas.js";

const {Schema} = mongoose;
//add more schema fields

const ReevItemSchema = new Schema({
    id: {
        type: String,
        unique: true,
    },
    category: String,
    sourceName: String,
    sourceUrl: String,
    sourceEndpoint: String,
    searchPhrase: String,
    itemInfo: {
        type: Schema.Types.Mixed,
        enum: [MovieSchema, ]
    }


    
});

export default ReevItemSchema;