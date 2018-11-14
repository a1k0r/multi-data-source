const {Pool} = require('pg');

const AbstractConnector = require('./abstract-connector.js');
const PostgresConnection = require('../connections/postgres-connection.js');

/**
 * @class
 * @extends AbstractConnector
 */
class PostgresConnector extends AbstractConnector {
    /**
     * @inheritDoc
     */
    constructor(config) {
        super(config);
        this.pool = new Pool({...config});
        this.pool.on('connect', () => {/* TODO: ping */});
        this.pool.on('error', () => {/* TODO: error */});
        // this.pool.on('error', () => {/* TODO: error */});
    }

    _doPing() {

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
    query(queryObject, queryParams, queryOptions = {}) {
        const {sql, addons} = queryObject;
        if (!sql) {
            throw new TypeError('Invalid query object, "sql" property missing');
        }
        const {templateParams = {}} = queryOptions;
        let queryText = sql;

        if (addons) {
            queryText = this._templater.processTemplates(queryObject, {...queryParams, ...templateParams});
        }

        const {query, params} = this._templater.parametrizeQuery(queryText, queryParams, this.config.type);
        return this.pool.query(query, params);
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
