require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
moment().format();

var action = process.argv[2];
var inputs = process.argv[3];
//var spotify = new Spotify(keys.spotify);

switch (action) {
  case "concert-this":
    concert(inputs);
    break;

  case "spotify-this-song":
    spotify(inputs);
    break;

  case "movie-this":
    movie(inputs);
    break;

  case "do-what-it-says":
    doit();
    break;
}

function concert(inputs) {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    inputs +
    "/events?app_id=codingbootcamp";

  axios.get(queryUrl).then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      var date = response.data[i].datetime;
      date = moment(date).format("MM/DD/YYYY");
      console.log("Name of the venue: " + response.data[i].venue.name);
      console.log("Venue location: " + response.data[i].venue.city);
      console.log("Date of the Event: " + date);
      console.log("----------------------------------------");
    }
  });
}

function spotify(inputs) {
  var spotify = new Spotify(keys.spotify);
  if (!inputs) {
    inputs = "The Sign";
  }
  spotify.search({ type: "track", query: inputs }, function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }

    var songInfo = data.tracks.items;
    console.log("Artist(s): " + songInfo[0].artists[0].name);
    console.log("Song Name: " + songInfo[0].name);
    console.log("Preview Link: " + songInfo[0].preview_url);
    console.log("Album: " + songInfo[0].album.name);
  });
}

function movie(inputs) {
  if (!inputs) {
    inputs = "Mr. Nobody";
  }
  var queryUrl =
    "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=9613e41";

  axios.get(queryUrl).then(function(response) {
    //console.log(response);
    console.log("Title of the movie: " + response.data.Title);
    console.log("Year the movie came out: " + response.data.Year);
    console.log("IMDB Rating of the movie: " + response.data.imdbRating);
    console.log(
      "Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value
    );
    console.log(
      "Country where the movie was produced: " + response.data.Country
    );
    console.log("Language of the movie: " + response.data.Language);
    console.log("Plot of the movie: " + response.data.Plot);
    console.log("Actors in the movie: " + response.data.Actors);
    console.log("ID: " + response.data.imdbID);
  });
}

function doit() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");

    if (dataArr[0] === "spotify-this-song") {
      var songSearch = dataArr[1].slice(1, -1);
      spotify(songSearch);
    } else if (dataArr[0] === "concert-this") {
      var eventSearch = dataArr[1].slice(1, -1);
      twitter(eventSearch);
    } else if (dataArr[0] === "movie-this") {
      var movieName = dataArr[1].slice(1, -1);
      movie(movieName);
    }
  });
}
