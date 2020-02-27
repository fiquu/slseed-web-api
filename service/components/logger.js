const { createLogger, transports, format, Logger, LoggerOptions } = require('winston');

const { timestamp, prettyPrint } = format;

/**
 * Creates a new logger with the provided component name and `@fiquu/logger` as module name.
 *
 * @param {string} component The name of the component to log for.
 *
 * @returns {Logger} The logger instance.
 */
module.exports = function (component) {
  const options = {
    level: process.env.LOG_LEVEL || 'info',
    transports: [new transports.Console()],
    defaultMeta: { component },
    format: format.combine(
      timestamp(),
      prettyPrint()
    )
  };

  return createLogger(options);
}
