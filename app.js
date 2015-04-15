if (!!process.env.PRODUCTION) {
    require('newrelic');
}

var express = require('express');
var url = require('url');
var crypto = require('crypto');
var request = require('request');

var app = express();

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
var clientCallback = process.env.CALLBACK_URI;
var encSecret = process.env.ENCRYPTION_SECRET;
var authString = new Buffer(clientId + ':' + clientSecret).toString('base64');
var authorizationHeader = 'Basic ' + authString;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var spotifyEndpoint = 'https://accounts.spotify.com/api/token';

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-ctr', encSecret);
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
 
function decrypt(text){
    var decipher = crypto.createDecipher('aes-256-ctr', encSecret);
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

app.post('/swap', function (req, res) {
    console.log(req.params);
    console.log(req);
    console.log(req.body);
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
            body.refresh_token = encrypt(body.refresh_token);
        }
        
        res.status(response.statusCode);
        res.json(body);
    });
});

app.post('/refresh', function (req, res) {
    var refreshToken = decerypt(req.query.refresh_token);
    
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
        res.status(response.statusCode);
        res.json(body);
    });
});

app.get('/', function(req, res) {
    res.send('Hello world!')
});

var server = app.listen(process.env.PORT || 2349, function () {
  console.log('Token app listening on port %s', process.env.PORT);
});