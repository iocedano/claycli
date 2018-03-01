'use strict';
const _ = require('lodash'),
  options = require('./cli-options'),
  log = require('../lib/terminal-logger')('config'),
  config = require('../lib/cmd/config');

function builder(yargs) {
  return yargs
    .usage('Usage: $0 config [value]')
    .example('$0 config --key local', 'View local api key')
    .example('$0 config --key prod as8d7s9d', 'Set prod api key')
    .example('$0 config --url some-article', 'Get url')
    .example('$0 config --url mysite domain.com', 'Set url')
    .option('k', options.key)
    .option('u', options.url);
}

function set(argv) {
  if (argv.key) {
    config.set('key', argv.key, argv.value);
    log.tick(`set ${argv.key} ${argv.value}`);
  } else if (argv.url) {
    config.set('url', argv.url, argv.value);
    log.tick(`set ${argv.url} ${argv.value}`);
  } else {
    log.status.error('Please provide either --key or --url');
    process.exit(1);
  }
}

function get(argv) {
  let type, key, val;

  if (argv.key) {
    type = 'key';
    key = argv.key;
    val = config.get('key', argv.key);
  } else if (argv.url) {
    type = 'url';
    key = argv.url;
    val = config.get('url', argv.url);
  } else {
    log.status.error('Please provide either --key or --url');
    process.exit(1);
  }

  // normally, we'd want to pass through any alias,
  // but here we're explicitly checking to see if the alias exists in the config
  if (!_.includes([key, `http://${key}`, process.env.CLAYCLI_DEFAULT_KEY, process.env.CLAYCLI_DEFAULT_URL], val)) {
    log.tick(val);
  } else {
    log.cross(`${type}: ${key} not found`);
  }
}

function handler(argv) {
  if (argv.value) {
    // set values
    set(argv);
  } else {
    get(argv);
  }
}

module.exports = {
  command: 'config [value]',
  describe: 'View or set config variables',
  aliases: ['configure', 'cfg'],
  builder,
  handler
};