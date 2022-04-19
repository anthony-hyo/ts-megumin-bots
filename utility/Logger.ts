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
                winston.format.colorize({
                    all:true
                }),
                winston.format.label({
                    label:'[LOGGER]'
                }),
                winston.format.timestamp({
                    format:"YY-MM-DD HH:MM:SS"
                }),
                winston.format.printf(
                    info => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
                )
            )
        }),
    ],
})

export default logger
