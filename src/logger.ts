const { createLogger, format, transports } = require('winston');
const { colorize, combine, timestamp, printf } = format;

const prodFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const devFormat = printf(info => {
  return `${info.level}: ${info.message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), colorize(), prodFormat),
  transports: [
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: '5000000', // 5mb
      maxFiles: '7',
      
    }),

    new transports.File({
      filename: 'logs/general.log',
      maxsize: '5000000', // 5mb
      maxFiles: '7',
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(timestamp(), colorize(), devFormat),

  }));
}

export default logger;
