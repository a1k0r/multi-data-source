const AbstractConnection = require('./abstract-connection.js');

/**
 * @inheritDoc
 */
class PostgresConnection extends AbstractConnection {
    /**
     * @async
     * @param {String} query SQL
     * @param {Array} params query params
     * @returns {Promise<Array>} result
     * @private
     */
    async _executeQuery(query, params) {
        const {rows} = await this.client.query(query, params);
        return rows;
    }

    /**
     * @inheritDoc
     */
    rawQuery(queryText, queryParams, queryOptions = null) {
        const {query, params} = this.templater.parametrizeQuery(queryText, queryParams, this.config.type);
        return this._executeQuery(query, params);
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
            queryText = this.templater.processTemplates(queryObject, {...queryParams, ...templateParams});
        }

        const {query, params} = this.templater.parametrizeQuery(queryText, queryParams, this.config.type);
        return this._executeQuery(query, params);
    }

    /**
     * @inheritDoc
     */
    async transaction() {
        await this.client.query('BEGIN;');
    }

    /**
     * @inheritDoc
     */
    async commit() {
        await this.client.query('COMMIT;');
    }

    /**
     * @inheritDoc
     */
    async rollback() {
        await this.client.query('ROLLBACK;');
    }

    /**
     * @inheritDoc
     */
    async release() {
        await this.client.release();
    }
}

module.exports = PostgresConnection;
