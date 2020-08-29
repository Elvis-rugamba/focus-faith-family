const winston = require('winston');
const config = require('./config');

const {
  combine, colorize, uncolorize, splat, printf, timestamp,
} = winston.format;

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const customFormat = printf(({ level, message }) => `${level}: ${message}`);

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    enumerateErrorFormat(),
    config.env === 'development' ? colorize() : uncolorize(),
    splat(),
    timestamp(),
    customFormat,
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;
