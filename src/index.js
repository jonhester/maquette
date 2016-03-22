import { Server } from 'hapi';
import routes from './routes';
import config from './config';
import Bcrypt from 'bcrypt';

const server = new Server();


const validate = (request, username, password, callback) => {
  if (username !== config.get('app.auth.user')) {
    return callback(null, false);
  }

  Bcrypt.compare(password, config.get('app.auth.password'), (err, isValid) => {
    callback(err, isValid, {});
  });
};


server.connection({
  host: process.env.HOSTNAME || '0.0.0.0',
  port: config.get('app.port') || 9200,
  routes: { cors: true },
});

server.register(
  [
    // plugins go here
    require('hapi-auth-basic'),
  ],
  (err) => {
    if (err) {
      console.error('Failed to load plugin: ', err);
    }

    server.auth.strategy('simple', 'basic', { validateFunc: validate });
    server.auth.default('simple');
    // add routes
    server.route(routes);
  }
);

server.start(() => {
  console.info('==> ✅  Server is listening');
  console.info(`==> 🌎  Go to ${server.info.uri.toLowerCase()}`);
});
