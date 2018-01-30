const AbstractConnection = require('./AbstractConnection');
const {escapeParams, QueryTemplater} = require('../query');

/**
 * @inheritDoc
 */
class PostgresConnection extends AbstractConnection {
    /**
     * @async
     * @param {String} query SQL
     * @returns {Promise<Array>} result
     * @private
     */
    async _executeQuery(query) {
        const {rows} = await this.client.query(query);
        return rows;
    }

    /**
     * @inheritDoc
     */
    rawQuery(queryText, queryParams, queryOptions = null) {
        const preparedQuery = escapeParams(queryText, queryParams);
        return this._executeQuery(preparedQuery);
    }

    /**
     * @inheritDoc
     */
    query(queryObject, queryParams, queryOptions = {}) {
        const {sql} = queryObject;
        let queryText = sql;

        const {templateParams} = queryOptions;
        if (templateParams) {
            queryText = QueryTemplater.buildQuery(queryObject, templateParams);
        }

        const preparedQuery = escapeParams(queryText, queryParams);

        return this._executeQuery(preparedQuery);
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
