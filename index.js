const {PostgresConnectorFactory} = require('./factories');

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
        /** @type {{String:AbstractConnectorFactory}} */
        this.factoriesAssociation = {
            'pg': new PostgresConnectorFactory(storageConfig),
        };
    }

    // addFactory(name, factory) {
    //     this.factoriesAssociation[name] = new factory(this.storageConfig)
    // }

    /**
     * @param {String} connectorName connector name
     * @returns {Promise.<AbstractConnector>} Connector
     */
    async getConnector(connectorName) {
        if (this.connectors.has(connectorName)) {
            return this.connectors.get(connectorName);
        }

        const {storageType} = this.storageConfig[connectorName];

        const connector = await this.factoriesAssociation[storageType].createConnector(connectorName);

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
     */
    async disconnectAll() {
        for (const [, connector] of this.connectors) {
            await connector.closeConnection();
            // log.info(`Connector ${name} disconnected`);
        }
    }
}

module.exports = DataStorage;

