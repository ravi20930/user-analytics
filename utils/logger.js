const winston = require('winston')
require('winston-daily-rotate-file')
const path = require('app-root-path')
const axios = require('axios');
const slackToken = process.env.SLACK_TOKEN;
const url = 'https://slack.com/api/chat.postMessage';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});


const infoTransport = new winston.transports.DailyRotateFile({
  filename: `${path}/logs/access-logs/application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  frequency: '24h',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d'
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: `${path}/logs/error-logs/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  frequency: '24h',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d'
})

infoTransport.on('rotate', function (oldFilename, newFilename) {
  // do something fun
})

errorTransport.on('rotate', function (oldFilename, newFilename) {
  // do something fun
})

const infoLogger = createLogger({
  format: combine(
    timestamp({ format: 'YY-MM-DD hh:mm:ss' }),
    format.errors({ stack: true }),
    myFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    infoTransport
  ]
})

const errorLogger = createLogger({
  format: combine(
    timestamp({ format: 'YY-MM-DD hh:mm:ss' }),
    format.errors({ stack: true }),
    format.json(),
    myFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    errorTransport
  ]
})

exports.log = (msg) => {
  infoLogger.info(msg);
}

exports.error = async (req, msg) => {
  errorLogger.error(req?.originalUrl + " " + msg);
  await axios.post(url, {
    channel: '#ims-logs',
    text: JSON.stringify(Date() + " " + req?.originalUrl + " " + msg)
  }, { headers: { authorization: `Bearer ${slackToken}` } });
}
