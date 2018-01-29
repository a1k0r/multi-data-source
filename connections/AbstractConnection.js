class AbstractConnection {
    constructor(config) {
        this.config = config;
        this.client = config.client;
        this.queries = config.queries;

        if (new.target === AbstractConnection) {
            throw new TypeError('Abstract class can not be created!');
        }
    }

    /**
     * @param {Object} queryObject
     * @param {Object} queryParams
     * @param {Object} queryOptions
     * @returns {Promise<Array>}
     */
    query(queryObject, queryParams, queryOptions = null) {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @returns {Promise<null>}
     */
    transaction() {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @returns {Promise<null>}
     */
    commit() {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @returns {Promise<null>}
     */
    rollback() {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @returns {String}
     */
    getQueryText(queryName) {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @param {String} queryText
     * @param {Array || Object} queryParams
     * @param {Object} queryOptions
     * @returns {Promise<Array>}
     */
    rawQuery(queryText, queryParams, queryOptions = null) {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @returns {Promise<null>}
     */
    release() {
        throw new TypeError('This method must be overridden!');
    }


}

module.exports = AbstractConnection;
