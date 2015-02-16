var Twitter = require('twitter');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var url = process.env.MONGO_URL;

client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    var collection = db.collection('javascript');
    stream.on('data', function(tweet) {
      collection.insert( tweet , function(err, result) {
        assert.equal(err, null);
      });
      console.log("***** Tweet by " + tweet.user.name + " *****");
      console.log(tweet.text);
    });
    stream.on('error', function(error) {
      throw error;
    });
  });
});
