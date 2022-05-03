import {Sequelize} from 'sequelize-typescript'
import logger from "../utility/Logger";
import Main from "../Main";

export default class Database {

	private readonly _sequelize: Sequelize

	constructor(main: Main) {
		this._sequelize = new Sequelize(main.config.database.dbname, main.config.database.user, main.config.database.password, {
			dialect: 'mariadb',
			host: main.config.database.host,
			port: main.config.database.port,
			pool: {
				max: 100
			},
			logging: false,
			modelPaths: [
				`${__dirname}/model/`
			],
		})

		this._sequelize
			.authenticate()
			.then(() => {
				logger.info("Database connected")

				this._sequelize
					.sync()
					.then(() => {
						logger.info("Database sync")
						main.init()
					})
					.catch(e => console.error('error 1', e))
			})
			.catch(e => console.error('error 2', e))
	}

	public get sequelize(): Sequelize {
		return this._sequelize;
	}

}
