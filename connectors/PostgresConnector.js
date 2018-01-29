const {Pool} = require('pg');
// const log = require('../../../../app/components/log')(module);

const AbstractConnector = require('./AbstractConnector');
const PostgresConnection = require('../connections/PostgresConnection');

class PostgresConnector extends AbstractConnector {
    constructor(config) {
        super(config);

        this.pool = new Pool({...config});

        // this.pool.on('error', error => {
        //     // log.error(`Something happened with Postgres pool ${config.storageName}. errorCode: ${error.code}. error: ${error}`);
        // });
    }

    async getConnection() {
        const client = await this.pool.connect();

        const config = {
            client,
            ...(this.config),
        };

        const connection = new PostgresConnection(config);

        return connection;
    }


    async releaseConnection(connection) {
        await connection.client.release();
    }

    async closeConnection() {
        await this.pool.end();
    }
}

module.exports = PostgresConnector;
