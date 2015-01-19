var mongoose = require ('mongoose');

var FeedSchema = new mongoose.Schema ({
    title : String,
    description : String,
    link : String,
    date : Date
});

module.exports = mongoose.model ('Feed', FeedSchema, 'Feed');