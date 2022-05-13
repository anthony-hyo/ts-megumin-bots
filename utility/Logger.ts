const winston = require('winston')

const logger = winston.createLogger({
	level: 'info',
	transports: [
		new winston.transports.File({
			handleExceptions: true,
			filename: `./log/bot.log`,
			format: winston.format.simple()
		}),
		new winston.transports.Console({
			handleExceptions: true,
			colorize: true,
			format: winston.format.combine(
				winston.format.colorize({
					all: true
				}),
				winston.format.timestamp({
					format: "YY-MM-DD HH:MM:SS"
				}),
				winston.format.printf((info: { label: any; timestamp: any; level: any; message: any }) => `(${info.timestamp}) ${info.level} : ${info.message}`)
			),
		}),
	],
})

export default logger
