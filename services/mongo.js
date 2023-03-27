const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;


//mongodb event emitter to run once the mongodb connection is ready
mongoose.connection.once('open', ()=>{
    console.log('mongodb Connection ready')
});

//when an error occurs
mongoose.connection.on('error', (err)=>{
    console.error(err);
});

async function connectToMongo(){
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true 
     });
}

async function disconnectFromMongo(){
    await mongoose.disconnect();
}

module.exports = {
    connectToMongo,
    disconnectFromMongo
}