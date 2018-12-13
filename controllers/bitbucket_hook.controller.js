module.exports = (req, res, controller) => {
  // respond to FB that the webhook has been received.
  res.status(200);
  res.send('ok');
  var room = req.params.room

  console.log('parent: '+room);
  console.log('Status 200 will be send');
  console.log('Header: '+req.headers)

  // controller.trigger('bitbucket_message', [
  //     bot,
  //     room,
  //     req
  // ]);

  var actorDisplayName = req.body.actor.display_name;
  var actorAvatarImageLink = req.body.actor.links.avatar.href;
  var pullrequestTitle = req.body.pullrequest.title.html
  var pullrequestDiffLink = req.body.pullrequest.links.diff.href

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

  var headerTitle = typeNameMain+": "+operation;
  var headerSubtitle = req.body.pullrequest.title.html;

  var threadK = req.body.pullrequest.links.html.href;

  var textTitle = req.body.pullrequest.rendered.title.html;
  var textDescription = req.body.pullrequest.rendered.description.html;

  var textBranch = req.body.pullrequest.destination.branch.name;
  var textReviewers = req.body.pullrequest.reviewers;
  var textCommentCount = req.body.pullrequest.comment_count;


  controller.spawn({}, function(bot) {
      bot.say(
          {
              parent: room,
              threadKey: threadK,
              requestBody: {
                  cards: [
                      {
                          "header": {
                              "title": headerTitle,
                              "subtitle": headerSubtitle,
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
                                                      "text": ""+req.body.pullrequest.links.html.href+"",
                                                      "onClick": {
                                                          "openLink": {
                                                              "url": req.body.pullrequest.links.html.href
                                                          }
                                                      }
                                                  }
                                              }
                                          ],
                                          "textParagraph": {
                                              "text": "<b>"+textTitle+"</b><br>"+
                                                      textDescription+"<br>"+
                                                      "<b>Branch: </b><br> <font color=\"#ff0000\">"+textBranch+"</font><br>"+
                                                      "<b>Reviewers: </b><br> "+textReviewers+"<br>"+
                                                      "<b>Comments: </b><br> "+textCommentCount+""
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

  console.log('Handled webhook payload');
}