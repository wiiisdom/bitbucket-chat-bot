# Bitbucket Chat Bot

#WORKINPROGRESS

**This bot is able to give you info about [BitBucket](https://bitbucket.org) PR on a [Google Hangouts Chat](https://chat.google.com/) room.**

## Running bitbucket-chat-bot locally

The environment variable ``$CREDS`` will contains the google credentials for sending
messages to Hangouts Chat. Tip from [here](https://github.com/googleapis/google-auth-library-nodejs/blob/master/README.md#loading-credentials-from-environment-variables). You will have the credentials in JSON format when you create
a [service account for Hangouts Chat](https://developers.google.com/hangouts/chat/how-tos/service-accounts)

```
export CREDS='{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-cert-url"
}'
npm install
npm start
```

## Testing manually

Once started locally you can launch queries to simulate bitbucket interactions. Here using [httpie](https://httpie.org/):

```
# New pull request
http :3000/bot/room_id x-event-key:pullrequest:comment_created @test/data/comment.json
# New comment on pull request
http :3000/bot/room_id x-event-key:pullrequest:comment_created @test/data/comment.json

```

## Testing

ToDo

```
npm test
```

## Deploy

Here is how to deploy on Dokku like systems:

```
git remote add dokku dokku@dokkuhost:appname
git push dokku
```

On dokku host:

```
dokku config:set --no-restart appname DOKKU_LETSENCRYPT_EMAIL=myemail
dokku letsencrypt appname
dokku config:set appname CREDS='{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-cert-url"
}'
```

Follow google-hangouts-chat publish procedure [here](https://developers.google.com/hangouts/chat/how-tos/bots-publish)

Activate webhook in BitBucket

- Go yo project settings in bitbucket
- Webhooks
- Add
- Trigger on all PR actions
- URL : ``https://appname.dokkuhost/bot/{room_id}``