import { Server } from 'hapi';
import routes from './routes';
import config from './config';

const server = new Server();

server.connection({
  host: process.env.HOSTNAME || '0.0.0.0',
  port: config.get('app.port') || 9200,
  routes: { cors: true },
});

server.register(
  [
    // plugins go here
  ],
  (err) => {
    if (err) {
      console.error('Failed to load plugin: ', err);
    }

    // add routes
    server.route(routes);
  }
);

server.start(() => {
  console.info('==> ✅  Server is listening');
  console.info(`==> 🌎  Go to ${server.info.uri.toLowerCase()}`);
});
