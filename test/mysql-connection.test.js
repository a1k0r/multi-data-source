const MysqlConnection = require('../connections/mysql-connection.js');
const sinon = require('sinon');
const assert = require('assert');
const {expect} = require('chai');

describe('Mysql connection', () => {
    const client = {
        query: () => new Promise(resolve => resolve([[{a: 1}]])),
    };

    const querySpy = sinon.spy(client, 'query');

    beforeEach(() => {
        querySpy.resetHistory();
    });

    const mq = new MysqlConnection({
        client,
        type: 'mysql',
    });

    describe('class', () => {
        it('should have "query" function', () => {
            expect(mq.query).to.be.instanceOf(Function);
        });
        it('should have "transaction" function', () => {
            expect(mq.transaction).to.be.instanceOf(Function);
        });
        it('should have "commit" function', () => {
            expect(mq.commit).to.be.instanceOf(Function);
        });
        it('should have "rollback" function', () => {
            expect(mq.rollback).to.be.instanceOf(Function);
        });
        it('should have "rawQuery" function', () => {
            expect(mq.rawQuery).to.be.instanceOf(Function);
        });
    });

    describe('.query', () => {
        it('should handle simple correct query', async () => {
            const query = {
                sql: 'SELECT * FROM table WHERE field1 = :field1 {{t1}}',
                addons: {
                    t1: {
                        sql: 'AND field2 = :field2',
                        options: {propertyName: 'field2t'},
                    },
                },
            };

            await mq.query(query, {field1: 1, field2: 2}, {templateParams: {field2t: true}});
            expect(querySpy.lastCall.args[0]).to.be.equal('SELECT * FROM table WHERE field1 = ? AND field2 = ?');
            expect(querySpy.lastCall.args[1]).to.be.deep.equal([1, 2]);
        });

        it('should handle simple correct query with repeated params', async () => {
            const query = {
                sql: 'SELECT * FROM table WHERE field1 = :field1 {{t1}}',
                addons: {
                    t1: {
                        sql: 'AND field2 = :field2 AND field1 = :field1',
                        options: {propertyName: 'field2t'},
                    },
                },
            };

            await mq.query(query, {field1: 1, field2: 2}, {templateParams: {field2t: true}});
            expect(querySpy.lastCall.args[0]).to.be.equal('SELECT * FROM table WHERE field1 = ? AND field2 = ? AND field1 = ?');
            expect(querySpy.lastCall.args[1]).to.be.deep.equal([1, 2, 1]);
        });

        it('should handle simple query without template params', async () => {
            const query = {
                sql: 'SELECT * FROM table WHERE field1 = :field1 {{t1}}',
                addons: {
                    t1: {
                        sql: 'AND field2 = :field2',
                        options: {propertyName: 'field2'},
                    },
                },
            };

            await mq.query(query, {field1: 1, field2: 2});
            expect(querySpy.lastCall.args[0]).to.be.equal('SELECT * FROM table WHERE field1 = ? AND field2 = ?');
            expect(querySpy.lastCall.args[1]).to.be.deep.equal([1, 2]);
        });

        it('should handle simple query without templates', async () => {
            const query = {
                sql: 'SELECT * FROM table WHERE field1 = :field1',
            };

            await mq.query(query, {field1: 1, field2: 2});
            expect(querySpy.lastCall.args[0]).to.be.equal('SELECT * FROM table WHERE field1 = ?');
            expect(querySpy.lastCall.args[1]).to.be.deep.equal([1]);
        });

        it('should throw on invalid query format', async () => {
            const query = {
                addons: {
                    t1: {
                        sql: 'AND field2 = :field2',
                        options: {propertyName: 'field2'},
                    },
                },
            };

            expect(() => mq.query(query, {field1: 1, field2: 2})).to.throw(/sql/);
        });
    });
});
