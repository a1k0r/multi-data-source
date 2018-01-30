const {Pool} = require('pg');

const AbstractConnector = require('./AbstractConnector');
const PostgresConnection = require('../connections/PostgresConnection');

/**
 * @inheritDoc
 */
class PostgresConnector extends AbstractConnector {
    /**
     * @inheritDoc
     */
    constructor(config) {
        super(config);

        this.pool = new Pool({...config});

        // this.pool.on('error', error => {
        //     // log.error(`Something happened with Postgres pool ${config.storageName}. errorCode: ${error.code}. error: ${error}`);
        // });
    }

    /**
     * @inheritDoc
     */
    async getConnection() {
        const client = await this.pool.connect();

        const config = {
            client,
            ...(this.config),
        };

        const connection = new PostgresConnection(config);

        return connection;
    }

    /**
     * @inheritDoc
     */
    async releaseConnection(connection) {
        await connection.client.release();
    }

    /**
     * @inheritDoc
     */
    async closeConnection() {
        await this.pool.end();
    }
}

module.exports = PostgresConnector;
