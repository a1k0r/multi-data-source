class AbstractConnector {
    constructor(config) {
        this.config = config;

        if (new.target === AbstractConnector) {
            throw new TypeError('Abstract class can not be created!');
        }
    }

    /**
     * @returns {Promise<AbstractConnection>} Connection
     */
    async getConnection() {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @param {AbstractConnection} connection Abstract connection
     */
    async releaseConnection(connection) {
        throw new TypeError('This method must be overridden!');
    }

    /**
     * @async
     */
    async closeConnection() {
        throw new TypeError('This method must be overridden!');
    }
}

module.exports = AbstractConnector;
