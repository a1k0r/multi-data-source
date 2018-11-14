const mysql = require('mysql2');
const AbstractConnector = require('./abstract-connector.js');
const MysqlConnection = require('../connections/mysql-connection.js');

/**
 * @class
 * @extends AbstractConnector
 */
class MysqlConnector extends AbstractConnector {
    /**
     * @inheritDoc
     */
    constructor(config) {
        super(config);
        const commonPool = mysql.createPool({...config});
        this.pool = commonPool.promise();
    }

    /**
     * @inheritDoc
     */
    async getConnection() {
        const client = await this.pool.getConnection();

        const config = {
            client,
            ...(this.config),
        };

        const connection = new MysqlConnection(config);
        return connection;
    }

    /**
     * @inheritDoc
     */
    async query(queryObject, queryParams, queryOptions = {}) {
        const conn = await this.getConnection();
        const result = await conn.query(queryObject, queryParams, queryOptions);
        await conn.release();
        return result;
    }

    /**
     * @inheritDoc
     */
    async releaseConnection(connection) {
        await this.pool.releaseConnection(connection.client);
    }

    /**
     * @inheritDoc
     */
    async closeConnection() {
        await this.pool.end();
    }
}

module.exports = MysqlConnector;
