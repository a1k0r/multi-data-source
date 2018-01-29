const AbstractConnection = require('./AbstractConnection');
// const log = require('../../../../app/components/log')(module);
// const {NoSuchQuery} = require('../errors');
const {escapeParams, QueryTemplater} = require('../query');

class PostgresConnection extends AbstractConnection {
    constructor(config) {
        super(config);
    }

    async _executeQuery(query) {
        const {rows} = await this.client.query(query);
        return rows;
    }

    async rawQuery(queryText, queryParams, queryOptions = null) {
        const {rows} = await this.client.query(queryText, queryParams);
        return rows;
    }

    async query(queryObject, queryParams, queryOptions = {}) {
        // TODO: unused destructed "types" need to add opportunity to pass array as PG arrays
        const {sql, types} = queryObject;
        let queryText = sql;

        const {templateParams} = queryOptions;
        if (templateParams) {
            queryText = QueryTemplater.buildQuery(queryObject, templateParams);
        }

        const preparedQuery = escapeParams(queryText, queryParams);

        return this._executeQuery(preparedQuery);
    }

    getQueryText(queryName) {
        return this.queries[queryName];
    }

    async transaction() {
        await this.client.query('BEGIN;');
    }

    async commit() {
        await this.client.query('COMMIT;');
    }

    async rollback() {
        await this.client.query('ROLLBACK;');
    }

    async release() {
        await this.client.release();
    }
}

module.exports = PostgresConnection;
