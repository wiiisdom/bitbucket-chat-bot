const chat = require('../services/chat.service')

exports.send = (type, room, msg) => {
  chat.spaces.messages.create({
      parent: `spaces/${room}`,
      threadKey: msg.thread,
      requestBody: {
          cards: [
            {
              "header": {
                "title": msg.type,
                "imageUrl": "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-03-21/334235045829_1d1db85d6877560365df_36.png"
              },
              "sections": [
                {
                  "widgets": [
                      {
                        "keyValue": {
                          "topLabel": "Pull Request",
                          "content": msg.pr_title,
                          "onClick": {
                            "openLink": {
                              "url": msg.link
                              }
                            },
                            "button": {
                              "textButton": {
                                 "text": "OPEN",
                                 "onClick": {
                                     "openLink": {
                                          "url": msg.link
                                      }
                                  }
                                }
                              }
                         }
                      },
                      {
                        "keyValue": {
                          "topLabel": "Message Author",
                          "content": msg.author
                          }
                      },
                      {
                        "textParagraph": {
                          "text": msg.text
                        }
                      },
                      {
                        "keyValue": {
                          "topLabel": "Reviewers",
                          "content": msg.reviewers.map((user) => user.display_name).join(', ')
                          }
                      },
                  ]
                }
              ]
            }
          ]
      }
  })
}