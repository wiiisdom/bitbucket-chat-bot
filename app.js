const express = require('express')
const bodyParser = require('body-parser')
const {google} = require('googleapis')
const {auth} = require('google-auth-library')

const app = express()
app.use(bodyParser.json())
const port = 3000

// connect to Hangouts Chat

console.log('test auth creds')
// load the environment variable with our keys
const creds = process.env.CREDS
if (!creds) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(creds)
const client = auth.fromJSON(keys)
client.scopes = ['https://www.googleapis.com/auth/chat.bot']
const chat = google.chat({
  version: 'v1',
  auth: client
});

app.post('/bot/:room', (req, res) => {
  var pr = req.body.pullrequest
  chat.spaces.messages.create({
      parent: 'spaces/AAAABmr8-uw',
      threadKey: `${pr.uuid}`,
      requestBody: {
          cards: [
            {
      "header": {
        "title": "BitBucket",
        "subtitle": "pizzabot@example.com",
        "imageUrl": "https://goo.gl/aeDtrS"
      },
      "sections": [
        {
          "widgets": [
              {
                "keyValue": {
                  "topLabel": "Id",
                  "content": `${pr.id}`
                  }
              },
              {
                "keyValue": {
                  "topLabel": "Name",
                  "content": `${pr.title}`
                }
              }
          ]
        },
        {
          "widgets": [
              {
                  "buttons": [
                    {
                      "textButton": {
                        "text": "OPEN ORDER",
                        "onClick": {
                          "openLink": {
                            "url": "https://example.com/orders/..."
                          }
                        }
                      }
                    }
                  ]
              }
          ]
        }
      ]
    }

          ],
          text: 'hello world'
      }
  })
  console.log(req.body.pullrequest.title)
  res.send(`Hello ${req.params.room}! `)
})

app.post('/', (req,res) => {
  res.send(`Hello ! `)  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))