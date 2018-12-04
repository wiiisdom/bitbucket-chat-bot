const message = require('../services/message.service')

exports.handle = function(req, res) {
  var type = req.get('x-event-key')
  var msg = undefined
  switch(type) {
    case 'pullrequest:created':
      msg = {
        thread: req.body.pullrequest.links.html.href,
        type: "New pull request",
        pr_title: req.body.pullrequest.title,
        text: req.body.pullrequest.description,
        author: req.body.actor.display_name,
        link: req.body.pullrequest.links.html.href,
        reviewers: req.body.pullrequest.reviewers
      }
      break;
    case 'pullrequest:updated':
      msg = {
        thread: req.body.pullrequest.links.html.href,
        type: "Updated pull request",
        pr_title: req.body.pullrequest.title,
        text: req.body.pullrequest.description,
        author: req.body.actor.display_name,
        link: req.body.pullrequest.links.html.href,
        reviewers: req.body.pullrequest.reviewers
      }
      break;
    case 'pullrequest:comment_created':
      msg = {
        thread: req.body.pullrequest.links.html.href,
        type: "New comment",
        pr_title: req.body.pullrequest.title,
        text: req.body.comment.content.html,
        author: req.body.comment.user.display_name,
        link: req.body.pullrequest.links.html.href,
        reviewers: req.body.pullrequest.reviewers
      }
      break;
    default:
      res.status(500).send(`${type} not managed`)

  }
  if(msg) {
    //console.log(msg)
    message.send(type, req.params.room, msg)
    res.send('OK')
  }

}