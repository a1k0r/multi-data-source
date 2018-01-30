const AbstractConnectorFactory = require('./AbstractConnectorFactory');
const {PostgresConnector} = require('../connectors');

/**
 * @inheritDoc
 */
class PostgresConnectorFactory extends AbstractConnectorFactory {
    /**
     * @inheritDoc
     */
    createConnector(storageName) {
        const config = this._getStorageConfig(storageName);
        const connector = new PostgresConnector({...config, storageName});
        return connector;
    }
}

module.exports = PostgresConnectorFactory;
