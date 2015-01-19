var mongoose = require ('mongoose');

var tweets = new mongoose.Schema ({
    user : String,
    tweet : String,
    ftweet : String,
    country : String,
    date : Date,
    latitude : Number,
    longitude : Number,
    lang : String,
    theme : String
});

module.exports = mongoose.model ('Tweets', tweets, 'Tweets');