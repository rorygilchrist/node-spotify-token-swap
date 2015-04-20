# Node Spotify Token Swap Service
Spotify Token Swap service for Node.js environments. Used to swap out and refresh tokens for client applications from Spotify SDKs.

![Travis Build](https://travis-ci.org/rorygilchrist/node-spotify-token-swap.svg?branch=master)

## Setting up
To begin using this service, simply clone this repository (`git clone git@github.com:rorygilchrist/node-spotify-token-swap.git`), set your environment variables and run `node app.js`. The required environment variables are as follows:
- `CLIENT_ID` - Your client's ID. This can be found on your app page on [Spotify Developer Portal](https://developer.spotify.com/my-applications/#!/applications).
- `CLIENT_SECRET` - Your client's secret key. This can be found on your app page on [Spotify Developer Portal](https://developer.spotify.com/my-applications/#!/applications).
- `CALLBACK_URL` - Your application's callback url. You should have set this up when you created your app.
- `ENCRYPTION_SECRET` - Secret key used to encrypt and decrypt your refresh tokens. If this is not set, a key will be automatically generated and will change on application restart causing all of your currently logged in users to be logged out on refresh.

Environment variables can be setup in Linux environments with the command:
` export FOO=bar`, where FOO is the variable name and bar is the value. An example would be `export CLIENT_ID=yourclientid`. This can also be done on Windows, but you're better off asking Google than me (: 

### Deploying to Heroku
This application is built for deployment in a Heroku environment (however it can be deployed anywhere else that Node.js can run). To follow this tutorial, you'll need the [Heroku Toolbelt](https://toolbelt.heroku.com/).

####Deploying your code
1. In your command line, navigate to the cloned repository run `heroku login` and enter your credentials.
2. Create a new application container for your token swap service `heroku create`
3. Set your environment variables by running `heroku config:set KEY=VALUE`, where KEY is a variable name, such as `CLIENT_ID` and VALUE is the value of the variable.
4. Run the command `git push heroku master` to deploy your application.
5. Finally, to fire up your server, run `heroku ps:scale web=1`. This will launch a free instance of your application which will shutdown after 10 minutes of inactivity and will be awoken when it's needed.

####Keeping your app alive
While Heroku is a great, easy to use, platform the fact it shuts your free app down after 10 minutes sucks. There is a way around this and it's super easy.
1. Navigate to the application folder and run the command `heroku addons:add newrelic:wayne`, this will create a New Relic account for you and add your app to it. 
2. Restart your server using the command `heroku ps:restart web`.
3. That's it, the rest has already been done for you. To monitor uptime, dive into the New Relic dashboard & configure pings.

###Using New Relic on a non-Heroku deploy
If you don't want to use Heroku to deploy your application, that's fine. You can still use New Relic to monitor uptime and performance. Simply [sign up](https://newrelic.com/signup), get your licence key and add it as an environment variable called `NEW_RELIC_LICENSE_KEY`. Once you've done this, restart your server and your data should start appearing in your New Relic dashboard.

##Using token swap service
The service has only two endpoints; one for swapping an auth code and the other for refreshing an access token.

####/swap
Takes POSTed `www-form-urlencoded` data, with the parameter `code` which should be the authentication code provided by Spotify post-login. The swap service returns a JSON object similar to that which Spotify would return itself, the only difference being the `refresh_token` is encrypted before being sent.

####/refresh
Takes POSTed `www-form-urlencoded` data, with the parameter `refresh_token` which should be the encrypted refresh token as provided by the `/swap` endpoint. The refresh token is then decrypted and used to get a new access token. The service *may* return a new encrypted refresh token, so your application should be set up to handle and store this.

*Note:* if your `ENCRYPTION_SECRET` has changed between /swap and /refresh requests, the encrypted refresh_token will be invalid for use within the swap service. The encrypted token however will stay active with Spotify until it either expires. It's recommended that when changing your `ENCRYPTION_SECRET`, you also regenerate your `CLIENT_SECRET` within the Spotify Developer Portal.
