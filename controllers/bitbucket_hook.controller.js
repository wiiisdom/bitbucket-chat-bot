module.exports = (req, res, controller) => {

  var actorDisplayName = req.body.actor.display_name;
  var actorAvatarImageLink = req.body.actor.links.avatar.href;

  var typeNameMain;
  var typeNameOperation;
  var type = req.get('x-event-key');

  var typeSplitted = type.split(":");
  switch(typeSplitted[0]) {
      case 'pullrequest':
          typeNameMain = 'Pull request';
          break;
      default:
          typeNameMain = 'Pull request';
  }
  var operationSplitted = typeSplitted[1].split("_");
  var operation = "";
  operationSplitted.forEach(element => {
      operation += element+" ";
  });

  var reviewersString = '';
  let pr = req.body.pullrequest
  pr.reviewers.forEach(element => {
    reviewersString += reviewersString+" "+element.display_name+", ";
  });
  reviewersString = reviewersString.substr(0, reviewersString.length-2);

  controller.spawn({}, function(bot) {
      bot.say(
        {
          parent: req.query.space,
          threadKey: pr.links.html.href,
          requestBody: {
            cards: [
              {
                "header": {
                  "title": typeNameMain+": "+operation,
                  "subtitle": pr.title.html,
                  "imageUrl": req.body.actor.links.avatar.href,
                  "imageStyle": "AVATAR"
                },
                "sections": [
                  {
                    "widgets": [
                      {
                        "buttons": [
                          {
                            "textButton": {
                              "text": ""+pr.links.html.href+"",
                              "onClick": {
                                "openLink": {
                                  "url": pr.links.html.href
                                }
                              }
                            }
                          }
                        ],
                        "textParagraph": {
                          "text": "<b>"+pr.rendered.title.html+"</b><br>"+
                          pr.rendered.description.html+"<br>"+
                          "<b>Branch: </b><br> <font color=\"#ff0000\">"+pr.source.branch.name+"</font><br>"+
                          "<b>Reviewers: </b><br><font color=\"#0000ee\">"+reviewersString+"</font><br>"+
                          "<b>Comments: </b><br> "+pr.comment_count+""
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      );
    });

    // respond to FB that the webhook has been received.
    res.send('ok');
}