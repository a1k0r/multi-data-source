const PostgresConnector = require('./postgres-connector');
const MysqlConnector = require('./mysql-connector');
const TestingConnector = require('./testing-connector');

module.exports = {
    PostgresConnector,
    TestingConnector,
    MysqlConnector,
};
