import mqtt from 'mqtt';
import models from './db/models';
import config from '../config.json';
import rp from 'request-promise';

const { host, port = 1883, prefix = 'smartthings' } = config.mqtt;

const mqttClient = mqtt.connect({ host, port });

const topicName = ({ type, name }) => `${prefix}/${name}/${type}`;
const commandTopicName = ({ type, name }) => `${topicName({ type, name })}/set`;

export default class client {
  static publish({ type, name, value, options = { retain: true } }) {
    const topic = topicName({ type, name });
    mqttClient.publish(topic, value, options);
  }

  static async subscribe({ type, name }) {
    mqttClient.subscribe(topicName({ type, name }));
    mqttClient.subscribe(commandTopicName({ type, name }));
  }
}

mqttClient.on('connect', async() => {
  const topics = await models.topic.findAll();
  const stateTopics = topics.map((topic) => topicName(topic));
  const commandTopics = topics.map((topic) => commandTopicName(topic));

  const subscriptions = stateTopics.concat(commandTopics);
  mqttClient.subscribe(subscriptions);
});

mqttClient.on('message', (topic, message) => {
  const topicArray = topic.split('/');
  let set = false;

  if (topic.endsWith('/set')) {
    set = true;
    topicArray.pop();
  }

  const type = topicArray.pop();
  const name = topicArray.pop();



  console.log({ name, type, value: message.toString() });

});
