const chat = require('../services/chat.service')


exports.handle = function(req, res) {
  var pr = req.body.pullrequest
  chat.spaces.messages.create({
      parent: `spaces/${req.params.room}`,
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
  res.send('OK')
}