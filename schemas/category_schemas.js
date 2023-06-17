import { Schema } from "mongoose";


export const MovieSchema = new Schema({
    image_url: String,
    thumbnail_rl: String,
    video_url: String,
    is_adult: Boolean,
    description: String,
    release_date: String,
    genre_ids: Array,
    id: Array,
    media_type: String,
    title: String,
    rating_count: Number,
    has_video: Boolean,
    language: String,
    rating: Number, 
});

export const GoogleSchema = new Schema({
    title: String,
    description: String,
    url: String,
    display_url: String,
    thumbnail_url: String,
    image_url: String,
    video_url: String,
    has_video: Boolean,
})


