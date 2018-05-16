const QueryTemplater = require('query-template');
/**
 * @abstract
 * @class {AbstractConnector}
 */
class AbstractConnector {
    /**
     * @param {Object} config config
     */
    constructor(config) {
        this.config = config;
        /**
         * @type {QueryTemplater}
         * @protected
         */
        this._templater = config.templater || new QueryTemplater();

        if (new.target === AbstractConnector) {
            throw new TypeError('Abstract class can not be created!');
        }
    }

    /**
     * @abstract
     * @async
     * @returns {Promise<AbstractConnection>} Connection
     */
    getConnection() {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * Pool.query proxy method
     * @abstract
     * @async
     * @param {{name: String, sql:String, addons: Object}} queryObject query data
     * @param {Object} queryParams named params
     * @param {Object} queryOptions options
     * @returns {Promise<Array>} query result
     */
    query(queryObject, queryParams, queryOptions = {}) {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @abstract
     * @async
     * @param {AbstractConnection} connection Abstract connection
     */
    releaseConnection(connection) {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @abstract
     * @async
     */
    closeConnection() {
        throw new TypeError('This method must be overridden!');
    }
}

module.exports = AbstractConnector;
