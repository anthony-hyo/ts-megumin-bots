import {Sequelize} from 'sequelize-typescript'
import logger from "../utility/Logger";
import Config from "../utility/Config";

export default class Database {

	private readonly config: Config

	private readonly sequelize: Sequelize

	constructor(config: Config) {
		this.config = config

		this.sequelize = new Sequelize(this.config.database.dbname, this.config.database.user, this.config.database.password, {
			dialect: 'mariadb',
			host: this.config.database.host,
			port: this.config.database.port,
			pool: {
				max: 100
			},
			logging: false,
			modelPaths: [
				`${__dirname}/model/`
			],
		})

		this.sequelize
			.authenticate()
			.then(() => {
				logger.info("Database connected")

				this.sequelize
					.sync()
					.then(() => {
						logger.info("Database sync")
					})
					.catch(e => console.error('error 1', e))
			})
			.catch(e => console.error('error 2', e))
	}

}
