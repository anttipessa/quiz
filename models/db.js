'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('bwa:mongo');

function connectDB(dbConfig) {
    let db = process.env.MONGODB_URI
    if (process.env.NODE_ENV === 'test') db = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`
    mongoose
        .connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => {
            mongoose.connection.on('error', (err) => {
                debug(err);
            });

            mongoose.connection.on('reconnectFailed', handleCriticalError);
        })
        .catch(handleCriticalError);
}

function handleCriticalError(err) {
    debug(err);
    throw err;
}

function disconnectDB() {
    mongoose.disconnect();
}


module.exports = { connectDB, disconnectDB };
