import winston from 'winston';
import 'dotenv/config';
import appRoot from 'app-root-path';

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false,
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

if (process.env.NODE_ENV !== 'test') {
  logger.add(
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.File(options.file),
  );
}

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

export default logger;
