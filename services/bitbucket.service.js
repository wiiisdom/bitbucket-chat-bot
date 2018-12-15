const axios = require('axios');
const qs = require('querystring');

/**
 * Check if credential available in user object
 */
exports.checkCredentials = (user_data) => new Promise((resolve,reject) => {
  if(user_data && user_data.auth) {
    resolve(user_data)
  }
  else {
    reject("Not logged yet !")
  }
})

/**
 * Get a valid BB token even (renew if needed)
 */
exports.handleValidToken = (user_data) => new Promise((resolve, reject) => {
  let auth = user_data.auth
  axios.get('https://api.bitbucket.org/2.0/user', {
    headers: {
      Authorization: `Bearer ${auth.access_token}`
    }
  })
  .then((response) => {
    // token still valid go to next step
    resolve(user_data)
  })
  .catch((error) => {
    // renew token
    axios.post('https://bitbucket.org/site/oauth2/access_token',
      qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: user_data.auth.refresh_token
      }), {
        auth: {
          username: process.env.BB_OAUTH_KEY,
          password: process.env.BB_OAUTH_SECRET
        }
      }
    )
    .then((response => {
      user_data.auth = response.data
      resolve(user_data)
    }))
    .catch((error) => {
      reject(error)
    })
  })
})

/**
 * Get user account on BB
 */
exports.user = (auth) => axios.get('https://api.bitbucket.org/2.0/user', {
  headers: {
    Authorization: `Bearer ${auth.access_token}`
  }
})

/**
 * Login on BB via OAuth2
 */
exports.login = (code) => axios.post('https://bitbucket.org/site/oauth2/access_token',
  qs.stringify({
    grant_type: 'authorization_code',
    code: code
  }), {
    auth: {
      username: process.env.BB_OAUTH_KEY,
      password: process.env.BB_OAUTH_SECRET
    }
  }
)

/**
 * Create a webhook on bitbucket
 */
exports.createHook = (user_data, username, repo_slug, space) => axios.post(`https://api.bitbucket.org/2.0/repositories/${username}/${repo_slug}/hooks`, {
  description: 'Hangouts Chat',
  url: `${process.env.HOSTNAME}/bitbucket/hook?`+qs.stringify({space: space}),
  active: true,
  events: [
      'pullrequest:unapproved',
      'pullrequest:approved',
      'pullrequest:comment_updated',
      'pullrequest:comment_created',
      'pullrequest:updated',
      'pullrequest:rejected',
      'pullrequest:fulfilled',
      'pullrequest:created'
  ]
}, {
  headers: {
      Authorization: `Bearer ${user_data.auth.access_token}`
  },
})