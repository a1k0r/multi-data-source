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
