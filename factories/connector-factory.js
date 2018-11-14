const {PostgresConnector, TestingConnector, MysqlConnector} = require('../connectors');
/**
 * @class
 */
class ConnectorFactory {
    /**
     * @constructor
     * @param {Object} storageConfig path to query file
     * @param {Object<String,AbstractConnector>|null} storageTypes associative array with storage type code key and connector class value
     */
    constructor(storageConfig, storageTypes = null) {
        this.storageConfig = storageConfig;
        /** @type Object<String,AbstractConnector> */
        this._storageTypes = storageTypes || this._getConnectorDefaults();
    }

    /**
     * @returns {Object<String,AbstractConnector>} default connector association config
     * @private
     */
    _getConnectorDefaults() {
        return {
            'pg': PostgresConnector,
            'mysql': MysqlConnector,
            'tst': TestingConnector,
        };
    }

    /**
     * @param {String} storageName storage name in config
     * @returns {Object} config
     * @protected
     */
    _getStorageConfig(storageName) {
        const config = this.storageConfig[storageName];
        if (!config) {
            throw new ReferenceError('Invalid storage name!');
        }

        return config;
    }

    /**
     * @param {String} storageName storage name
     * @returns {AbstractConnector} connector
     */
    createConnector(storageName) {
        const config = this._getStorageConfig(storageName);
        const {storageType} = config;

        const Connector = this._storageTypes[storageType];

        if (Connector) {
            return new Connector({...config, storageName});
        }

        throw new TypeError(`Invalid storage type ${storageType}`);
    }
}

module.exports = ConnectorFactory;
