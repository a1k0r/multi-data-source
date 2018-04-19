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
     * Method for graceful shutdown
     * @async
     */
    async disconnectAll() {
        for (const [, connector] of this.connectors) {
            await connector.closeConnection();
            // log.info(`Connector ${name} disconnected`);
        }
    }
}

module.exports = DataStorage;

