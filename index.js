const ConnectorFactory = require('./factories/connector-factory.js');

/**
 * @class
 */
class DataStorage {
    /**
     * @constructor
     * @param {Object} storageConfig sc
     * @private
     */
    constructor(storageConfig) {
        this.storageConfig = storageConfig;
        /** @type {Map<String,AbstractConnector>} */
        this.connectors = new Map();
        this._factory = new ConnectorFactory(storageConfig);
    }

    /**
     * @param {String} connectorName connector name
     * @returns {AbstractConnector} Connector
     */
    getConnector(connectorName) {
        if (this.connectors.has(connectorName)) {
            return this.connectors.get(connectorName);
        }

        const connector = this._factory.createConnector(connectorName);

        if (connector) {
            this.connectors.set(connectorName, connector);
        } else {
            throw new ReferenceError('Connector not created');
        }

        return connector;
    }

    /**
     * @param {String} connectorName connector name
     * @returns {Promise.<AbstractConnection>} connection
     */
    async getConnection(connectorName) {
        const connector = await this.getConnector(connectorName);

        return connector.getConnection();
    }

    /**
     * @async
     * @param {String} connectorName connector name
     * @param {{name: String, sql:String, addons: Object}} queryObject query data
     * @param {Object} queryParams named params
     * @param {Object} queryOptions options
     * @returns {Promise<Array>} query result
     */
    async query(connectorName, queryObject, queryParams, queryOptions = {}) {
        let connection;
        try {
            connection = await this.getConnection(connectorName);
            const data = await connection.query(queryObject, queryParams, queryOptions);
            return data;
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                await connection.release();
            }
        }
    }

    /**
     * Method for graceful shutdown
     * @async
     */
    async disconnectAll() {
        for (const [, connector] of this.connectors) {
            await connector.closeConnection();
        }
    }
}

module.exports = DataStorage;

