require("dotenv").config();
var keys = require("./keys.js");

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require('request');

var fs = require("fs");

var command = process.argv[2];
var searchTerm = process.argv[3];

if (command === "do-what-it-says") {
    fs.readFile("./random.txt", "utf8", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var dataArr = data.split(",");
            command = dataArr[0];
            searchTerm = dataArr[1];
        }
    });
} else { } // Do nothing

if (command === "my-tweets") {
    var params = { screen_name: 'Duffman96907140' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i in tweets) {
                console.log(tweets[i].text);
                console.log("\n");
            }
        }
    });
} 
else if (command === "spotify-this-song") {
    // search: function({ type: 'artist OR album OR track',
    //     query: 'My search query', limit: 20 }, callback);


    if (!searchTerm) {
        var query = "The Sign";
    } else {
        var query = searchTerm;
    }

    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var info = data.tracks.items[0].album;
        var artist = info.artists[0].name;
        var song = info.name;
        var preview = data.tracks.items[0].preview_url;
        console.log("Artist: " + artist);
        console.log("Song: " + song);
        console.log("Preview: " + preview);
    });

} 
else if (command === "movie-this") {
    if (!searchTerm) {
        var movie = "Mr. Nobody";
    } else {
        var movie = searchTerm;
    }
    request('http://www.omdbapi.com/?apikey=11c071d4&t=' + movie, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body);

        body = JSON.parse(body);
        var title = body.Title,
            year = body.Year,
            imdbRat = body.Ratings[0].Value,
            rtScore = body.Ratings[1].Value,
            country = body.Country,
            language = body.Language,
            plot = body.Plot,
            actors = body.Actors;

        console.log("Title: " + title);
        console.log("Year: " + year);
        console.log("IMBD Rating: " + imdbRat);
        console.log("Rotten Tomatoes Score: " + rtScore);
        console.log("Country: " + country);
        console.log("Language: " + language);
        console.log("Plot: " + plot);
        console.log("Actors: " + actors);

    });
}

else {
    console.log("List of acceptable commands: \n my-tweets \n spotify-this-song" +
        " \n movie-this \n do-what-it-says");
}

