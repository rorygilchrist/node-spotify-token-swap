# Node Spotify Token Swap Service
Spotify Token Swap service for Node.js environments. Used to swap out and refresh tokens for client applications from Spotify SDKs.

## Setting up
To begin using this service, simply clone this repository (`git clone git@github.com:rorygilchrist/node-spotify-token-swap.git`), set your environment variables and run `node app.js`. The required environment variables are as follows:
- CLIENT_ID - Your client's ID. This can be found on your app page on Spotify Developer Portal.
- CLIENT_SECRET - Your client's ID. This can be found on your app page on Spotify Developer Portal.
- CALLBACK_URL - Your application's callback url. You should have set this up when you created your app.
- ENCRYPTION_SECRET - Secret key used to encrypt and decrypt your refresh tokens. If this is not set, a key will be automatically generated and will change on application restart causing all of your currently logged in users to be logged out on refresh.

Environment variables can be setup in Linux environments with the command:
` export FOO=bar`, where FOO is the variable name and bar is the value. An example would be `export CLIENT_ID=yourclientid`

## Deploying to Heroku
This application is built for deployment in a Heroku environment (however it can be deployed anywhere else that Node.js can run). To follow this tutorial, you'll need the Heroku Toolbelt.

###Setting up Heroku Environment Variables
First, you need an application on Heroku. See their Getting Started Guide on how to do this. Once you have your application setup, visit the "Settings Tab" and click "Reveal Config Vars". Click "Edit" and then enter the environment variables where "KEY" is the variable name and "VALUE" is it's value.

###Deploying your code
1. In your command line, navigate to the cloned repository run `heroku login` and enter your credentials.
2. Find your Heroku git repository URL. This should be on the Settings page under Info -> Git URL
3. Add the Heroku respository as a remote in your command line, using `git remote add {git url} heroku`
4. Run the command `git push heroku master` and watch your application deploy.
5. To fire up the server, use the command `heroku ps:scale web.1`