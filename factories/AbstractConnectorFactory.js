// const config = require('../../../../app/components/config');

/**
 * @class
 */
class AbstractConnectorFactory {
    /**
     * @constructor
     * @param {Object} storageConfig path to query file
     */
    constructor(storageConfig) {
        this.storageConfig = storageConfig;
        // this.queryPath = queryPath;

        if (new.target === AbstractConnectorFactory) {
            throw new TypeError('You can not create instance of abstract class');
        }
    }

    /**
     * @param {String} storageName storage name
     * @returns {Promise<AbstractConnector>} connector
     */
    createConnector(storageName) {
        return null;
    }
}

module.exports = AbstractConnectorFactory;
