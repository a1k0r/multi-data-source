const AbstractConnection = require('./AbstractConnection');
// const log = require('../../../../app/components/log')(module);
// const {NoSuchQuery} = require('../errors');
const {escapeParams, QueryTemplater} = require('../query');

class PostgresConnection extends AbstractConnection {
    constructor(config) {
        super(config);
    }

    // async query(queryName, queryParams, queryOptions = null) {
    //     const self = this;
    //
    //     // let timeOld;
    //     // if (queryOptions && queryOptions.time) {
    //     //     timeOld = Date.now();
    //     // }
    //
    //     const data = await self.client.query(self.queries[queryName], queryParams);
    //     const {rows} = data;
    //
    //     // if (queryOptions && queryOptions.time) {
    //     //     log.info(`Query ${queryName} execution time: ${Date.now() - timeOld} ms`);
    //     // }
    //
    //     return rows;
    // }
    async _executeQuery(query) {
        const {rows} = await this.client.query(query);
        return rows;
    }

    async rawQuery(queryText, queryParams, queryOptions = null) {
        // let timeOld;
        // if (queryOptions && queryOptions.time && queryOptions.queryName) {
        //     timeOld = Date.now();
        // }

        const {rows} = await this.client.query(queryText, queryParams);

        // if (queryOptions && queryOptions.time) {
        //     log.info(`Query ${queryOptions.queryName} execution time: ${Date.now() - timeOld} ms`);
        // }

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
        console.log(preparedQuery);

        // return this._executeQuery(preparedQuery);
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
