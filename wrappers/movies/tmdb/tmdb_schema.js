import mongoose from "mongoose";
import DbItemSchema from "../../../schemas/reev_item_schema.js";
import 'dotenv/config'

const {Schema} = mongoose;

const TmdbMovieSchema = new Schema({
    poster_path: String,
    adult: Boolean,
    overview: String,
    release_date: String,
    original_title: String,
    genre_ids: Array,
    id: Array,
    media_type: String,
    original_language: String,
    title: String,
    backdrop_path: String || null,
    popularity: Number,
    vote_count: Number,
    video: Boolean,
    vote_average: Number,   
});


const TmdbTvShowSchema = new Schema(TmdbMovieSchema.add({
    original_name: String,
    origin_country: String,
}));

const TmdbPeopleSchema = new Schema(TmdbTvShowSchema.add({
    name: String,
}));

TmdbTvShowSchema.add(DbItemSchema);
TmdbMovieSchema.add(DbItemSchema);
TmdbPeopleSchema.add(DbItemSchema);

const TmdbMongoConnection = mongoose.createConnection(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
 });

TmdbMongoConnection.model('TmdbMovieSchema', TmdbMovieSchema);
TmdbMongoConnection.model('TmdbTvShowSchema', TmdbTvShowSchema);
TmdbMongoConnection.model('TmdbPeopleSchema', TmdbPeopleSchema);


export default TmdbMongoConnection;
export {
    TmdbMovieSchema,
    TmdbPeopleSchema,
    TmdbTvShowSchema,
};
