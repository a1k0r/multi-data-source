const {Pool} = require('pg');

const AbstractConnector = require('./abstract-connector.js');
const PostgresConnection = require('../connections/postgres-connection.js');

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
