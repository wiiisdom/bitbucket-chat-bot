/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

This is a sample Google Hangouts Chat bot built with Botkit.

# RUN THE BOT :

  Follow the instructions here to set up your Facebook app and page:
    -> https://developers.google.com/hangouts/chat/how-tos/bots-publish

  Run your bot from the command line:
    DEBUG=botkit:* \
    PORT=YOUR_APP_PORT \
    GOOGLE_APPLICATION_CREDENTIALS=YOUR_GOOGLE_CREDENTIALS_FILE \
    GOOGLE_VERIFICATION_TOKEN=YOUR_GOOGLE_VERIFICATION_TOKEN \
    node bot.js
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const env = require('node-env-file');

env(__dirname + '/.env');

let google_auth_params = {}
if(process.env.GOOGLE_APPLICATION_CREDENTIALS_DATA) {
  // Handle json file as a environement variable for Heroku like systems
  let google_auth_params = {
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_DATA)
  }
}
else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_APPLICATION_CREDENTIALS_DATA) {
    console.log('Error: Specify a GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_DATA in environment.');
    process.exit(1);
}

const Botkit = require('botkit')

const mongoStorage = require('botkit-storage-mongo')({mongoUri: process.env.MONGO_URL || 'mongodb://localhost/bb'})

const endpoint = "receive";
const token = process.env.GOOGLE_VERIFICATION_TOKEN;
const port = process.env.PORT || 3000;
const debug = true;

const controller = Botkit.googlehangoutsbot({
    endpoint,
    token,
    port,
    debug,
    storage: mongoStorage,
    google_auth_params: google_auth_params
});

const bot = controller.spawn({});
const webserver = require(__dirname + '/components/express_webserver.js')(controller, bot);

const normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./skills/" + file)(controller);
});
