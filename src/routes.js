import client from './client';
import models from './db/models';
import config from './config';
import oauth2 from 'simple-oauth2';
import rp from 'request-promise';

const ENDPOINTS = 'https://graph.api.smartthings.com/api/smartapps/endpoints';

const oauth = oauth2({
  clientID: config.get('oauth.clientId'),
  clientSecret: config.get('oauth.clientSecret'),
  site: 'https://graph.api.smartthings.com',
});

const authorizationUri = oauth.authCode.authorizeURL({
  redirect_uri: `${config.get('app.host')}/oauth`,
  scope: 'app',
  state: '3(#0/!~',
});

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      // check for token
      if (config.get('endpoint.token')) return reply('Looking good');

      return reply().redirect(authorizationUri);
    },

  },
  {
    method: 'GET',
    path: '/oauth',
    handler: (request, reply) => {
      const code = request.query.code;

      const saveToken = async (error, result) => {
        if (error) return reply(error.message);

        // result.access_token is the token, get the endpoint
        const bearer = result.access_token;

        const options = { uri: `${ENDPOINTS}?access_token=${bearer}`, json: true };

        const response = await rp(options);
        const accessUrl = response[0].url;

        config.set('endpoint', {
          url: accessUrl,
          token: bearer,
        });

        return reply(`<pre>https://graph.api.smartthings.com/${accessUrl}</pre><br><pre>Bearer ${bearer}</pre>`);
      };

      oauth.authCode.getToken({
        code,
        redirect_uri: `${config.get('app.host')}/oauth`,
      }, saveToken);
    },
  },
  {
    method: 'POST',
    path: '/push',
    handler: async (request, reply) => {
      const { name, type, value } = request.payload;

      // push to mqtt
      try {
        const topic = await models.topic.findOne({ where: { type, name } });

        if (!topic) {
          models.topic.create({ type, name, value });
          client.subscribe({ type, name });
        } else {
          topic.value = value;
          topic.save();
        }
        client.publish({ type, name, value });
      } catch (e) {
        console.error(e);
      }

      reply().code(204);
    },
  },
  {
    method: 'POST',
    path: '/subscribe',
    handler: (request, reply) => {
      reply().code(204);
    },
  },
];

export default routes;
