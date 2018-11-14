const AbstractConnection = require('./abstract-connection.js');

/**
 * @inheritDoc
 */
class MysqlConnection extends AbstractConnection {
    /**
     * @async
     * @param {String} query SQL
     * @param {Array} params query params
     * @returns {Promise<Array>} result
     * @private
     */
    async _executeQuery(query, params) {
        const [rows] = await this.client.query(query, params);
        return rows;
    }

    /**
     * @inheritDoc
     */
    async transaction() {
        await this.client.query('BEGIN;');
    }

    /**
     * @inheritDoc
     */
    async commit() {
        await this.client.query('COMMIT;');
    }

    /**
     * @inheritDoc
     */
    async rollback() {
        await this.client.query('ROLLBACK;');
    }

    /**
     * @inheritDoc
     */
    async release() {
        await this.client.release();
    }
}

module.exports = MysqlConnection;
