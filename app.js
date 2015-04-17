/**
 * If we have a new relic license key, we'll use it.
 * This is useful for keeping Heroku instances online.
 */
if (!!process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
}

if (!process.env.CLIENT_ID ||
    !process.env.CLIENT_SECRET ||
    !process.env.CALLBACK_URI
) {
    console.log('Environment variables not set up correctly. Please set CLIENT_ID, CLIENT_SECRET and CALLBACK_URI in the environment this app is running in. For help, see README');
    process.exit(1);
}

var express = require('express');
var url = require('url');
var request = require('request');
var encrpytion = require('./encryption.js');

var app = express();

/**
 * Set these variables in your local environment.
 * Your client ID and secret can be found in your app
 * settings in Spotify Developer.
 */
var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
var clientCallback = process.env.CALLBACK_URI;
var authString = new Buffer(clientId + ':' + clientSecret).toString('base64');
var authorizationHeader = 'Basic ' + authString;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var spotifyEndpoint = 'https://accounts.spotify.com/api/token';

/**
 * Swap endpoint
 *
 * Uses an authentication code on req.body to request access and
 * refresh tokens. Refresh token is encrypted for safe storage.
 */
app.post('/swap', function (req, res) {
    var formData = {
        grant_type : 'authorization_code',
        redirect_uri : clientCallback,
        code : req.body.code
    };
    
    var options = {
        uri : url.parse(spotifyEndpoint),
        headers : {
            'Authorization' : authorizationHeader
        },
        form : formData,
        method : 'POST',
        json : true
    }

    request(options, function(error, response, body) {
        if (response.statusCode === 200) {
            body.refresh_token = encrpytion.encrypt(body.refresh_token);
        }
        
        res.status(response.statusCode);
        res.json(body);
    });
});

/**
 * Refresh endpoint
 *
 * Uses the encrypted token on request body to get a new access token.
 * If spotify returns a new refresh token, this is encrypted and sent
 * to the client, too.
 */
app.post('/refresh', function (req, res) {
    if (!req.body.refresh_token) {
        res.status(400).json({ error : 'Refresh token is missing from body' });
        return;
    }

    var refreshToken = encrpytion.decrypt(req.body.refresh_token);
    
    var formData = {
        grant_type : 'refresh_token',
        refresh_token : refreshToken
    };
    
    var options = {
        uri : url.parse(spotifyEndpoint),
        headers : {
            'Authorization' : authorizationHeader
        },
        form : formData,
        method : 'POST',
        json : true
    }

    request(options, function(error, response, body) {
        if (response.statusCode === 200 && !!body.refresh_token) {
            body.refresh_token = encrpytion.encrypt(body.refresh_token);
        }

        res.status(response.statusCode);
        res.json(body);
    });
});

/**
 * Present a nice message to those who are trying to find a default
 * endpoint for the service.
 */
app.get('/', function(req, res) {
    res.send('Hello world!')
});

var server = app.listen(process.env.PORT || 4343, function () {
  console.log('Token app listening on port %s', process.env.PORT || 4343);
});
