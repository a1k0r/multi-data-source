const AbstractConnection = require('./abstract-connection');
const MockManager = require('../mock/mock-manager.js');

/**
 * @inheritDoc
 */
class TestingConnection extends AbstractConnection {
    /**
     * @inheritDoc
     */
    rawQuery(queryText, queryParams, queryOptions = null) {
    }

    /**
     * @inheritDoc
     */
    query(queryObject, queryParams, queryOptions = {}) {
        // TODO: make standard with NODE_ENV naming rules
        // TODO: use utils? module to check environment
        return MockManager.mockQuery(queryObject, queryParams);
    }

    /**
     * @inheritDoc
     */
    async transaction() {
        // await this.client.query('BEGIN;');
    }

    /**
     * @inheritDoc
     */
    async commit() {
        // await this.client.query('COMMIT;');
    }

    /**
     * @inheritDoc
     */
    async rollback() {
        // await this.client.query('ROLLBACK;');
    }

    /**
     * @inheritDoc
     */
    async release() {
        // await this.client.release();
    }
}

module.exports = TestingConnection;
