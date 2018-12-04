const {google} = require('googleapis')
const {auth} = require('google-auth-library')

// load the environment variable with our keys
const creds = process.env.CREDS
if (!creds) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(creds)
const client = auth.fromJSON(keys)
client.scopes = ['https://www.googleapis.com/auth/chat.bot']

module.exports = google.chat({
  version: 'v1',
  auth: client
});