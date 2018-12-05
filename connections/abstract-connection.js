const QueryTemplater = require('query-template');
/**
 * @class {AbstractConnection}
 * @abstract
 */
class AbstractConnection {
    /**
     * @param {{client: object, queries: object?, templater: object?, type: string}} config config obj
     */
    constructor(config) {
        this.config = config;
        this.client = config.client;
        this.queries = config.queries;
        this.templater = config.templater || new QueryTemplater();

        if (new.target === AbstractConnection) {
            throw new TypeError('Abstract class can not be created!');
        }
    }

    /**
     * @abstract
     * @param {String} query query string
     * @param {Object|Array} params params object/array/etc
     * @returns {Promise<Array>} result
     * @protected
     */
    _executeQuery(query, params) {
        throw new TypeError('Method "_executeQuery" must be overridden!');
    }

    /**
     * @abstract
     * @async
     * @param {{name: String, sql:String, addons: Object}} queryObject query data
     * @param {Object} queryParams named params
     * @param {Object} queryOptions options
     * @returns {Promise<Array>} query result
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

        const {query, params} = this.templater.parametrizeQuery(queryText, queryParams, this.config.storageType || this.config.type);
        return this._executeQuery(query, params);
    }

    /**
     * @abstract
     * @async
     * @returns {Promise<null>} null
     */
    transaction() {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @abstract
     * @async
     * @returns {Promise<null>} null
     */
    commit() {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @abstract
     * @async
     * @returns {Promise<null>} null
     */
    rollback() {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * Execute query without templates (parameterizing only!)
     * @abstract
     * @async
     * @param {String} queryText SQL
     * @param {Object} queryParams Named params
     * @param {Object} queryOptions Options
     * @returns {Promise<Array>} Query result
     */
    rawQuery(queryText, queryParams, queryOptions = null) {
        const {query, params} = this.templater.parametrizeQuery(queryText, queryParams, this.config.type);
        return this._executeQuery(query, params);
    }

    /**
     * @abstract
     * @async
     * @returns {Promise<null>} null
     */
    release() {
        throw new TypeError('This method must be overridden!');
    }
}

module.exports = AbstractConnection;
