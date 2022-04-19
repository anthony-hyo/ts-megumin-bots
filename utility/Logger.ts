const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            json: false,
            handleExceptions: true,
            colorize: true,
            filename: `./log/bot.log`,
        }),
        new winston.transports.Console({
            json: false,
            handleExceptions: true,
            colorize: true,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
    ],
})

export default logger
