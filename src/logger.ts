import winston from 'winston';

const { createLogger, format, transports } = winston;

const winstonFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// Logger for the WEB component
const webLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'WEB' }),
        winston.format.timestamp(),
        winstonFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log.log' })
    ]
});
// Logger for the ROS component
const rosLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'ROS' }),
        winston.format.timestamp(),
        winstonFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log.log' })
    ]
});


module.exports = {
    webLogger: webLogger,
    rosLogger: rosLogger,
}