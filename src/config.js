import config from '../config.json';
import _ from 'lodash';
import fs from 'fs';

export default class {
  static get(key) {
    return _.get(config, key);
  }

  static set(key, value) {
    console.log('setting', key, value);
    _.set(config, key, value);
    fs.writeFile(`${__dirname}/../config.json`, JSON.stringify(config, null, 2), (err) => {
      if (err) throw err;
      console.log('Updated config saved');
    });
  }
}
