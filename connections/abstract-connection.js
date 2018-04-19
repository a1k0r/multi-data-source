/**
 * @class {AbstractConnection}
 * @abstract
 */
class AbstractConnection {
    /**
     * @param {{client: object, queries: object?}} config config obj
     */
    constructor(config) {
        this.config = config;
        this.client = config.client;
        this.queries = config.queries;

        if (new.target === AbstractConnection) {
            throw new TypeError('Abstract class can not be created!');
        }
    }

    /**
     * @abstract
     * @async
     * @param {{name: String, sql:String, addonds: Object}} queryObject query data
     * @param {Object} queryParams named params
     * @param {Object} queryOptions options
     * @returns {Promise<Array>} query result
     */
    query(queryObject, queryParams, queryOptions = null) {
        throw new TypeError('This method must be overridden!');
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
     * @abstract
     * @async
     * @param {String} queryText SQL
     * @param {Object} queryParams Named params
     * @param {Object} queryOptions Options
     * @returns {Promise<Array>} Query result
     */
    rawQuery(queryText, queryParams, queryOptions = null) {
        throw new TypeError('This method must be overridden!');
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
