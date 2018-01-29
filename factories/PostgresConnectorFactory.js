const AbstractConnectorFactory = require('./AbstractConnectorFactory');
const {PostgresConnector} = require('../connectors');
const {QueryGetter} = require('../query');

/**
 * @class
 */
class PostgresConnectorFactory extends AbstractConnectorFactory {
    _getStorageConfig(storageName) {
        const config = this.storageConfig[storageName];
        if (!config) {
            throw new ReferenceError('Invalid storage name!');
        }

        return config;
    }

    async createConnector(storageName) {
        const config = this._getStorageConfig(storageName);

        // const queryGetter = new QueryGetter({fileName: this.queryPath});

        // const queries = await queryGetter.getQueries();
        // this.storageConfig.queries = queries;
        const connector = new PostgresConnector({...config, storageName});

        return connector;
    }
}

module.exports = PostgresConnectorFactory;
