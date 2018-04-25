const AbstractConnector = require('./abstract-connector.js');
const TestingConnection = require('../connections/testing-connection.js');

/**
 * @inheritDoc
 */
class TestingConnector extends AbstractConnector {
    /**
     * @inheritDoc
     */
    constructor(config) {
        super(config);
    }

    /**
     * @inheritDoc
     */
    async getConnection() {
        // TODO simple object just for initial testing
        const client = {};

        const config = {
            client,
            ...(this.config),
        };

        const connection = new TestingConnection(config);

        return connection;
    }

    /**
     * @inheritDoc
     */
    async releaseConnection(connection) {
        // await connection.client.release();
    }

    /**
     * @inheritDoc
     */
    async closeConnection() {
        // await this.pool.end();
    }
}

module.exports = TestingConnector;
