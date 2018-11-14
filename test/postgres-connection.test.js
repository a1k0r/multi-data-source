// const jest = require('jest');
// const PostgresConnection = require('../connections/postgres-connection.js');
//
// describe('Postgres connection', () => {
//     const client = {
//         query: jest.fn((query, params) => Promise.resolve({query, params})),
//     };
//
//     beforeEach(() => {
//         client.query.mockClear();
//     });
//
//     const pq = new PostgresConnection({
//         client,
//         type: 'pg',
//     });
//
//     describe('class', () => {
//         test('should have "query" function', () => {
//             expect(pq.query).toBeInstanceOf(Function);
//         });
//         test('should have "transaction" function', () => {
//             expect(pq.transaction).toBeInstanceOf(Function);
//         });
//         test('should have "commit" function', () => {
//             expect(pq.commit).toBeInstanceOf(Function);
//         });
//         test('should have "rollback" function', () => {
//             expect(pq.rollback).toBeInstanceOf(Function);
//         });
//         test('should have "rawQuery" function', () => {
//             expect(pq.rawQuery).toBeInstanceOf(Function);
//         });
//     });
//
//     test('should handle simple query with right format', async () => {
//         const query = {
//             sql: 'SELECT * FROM table WHERE field1 = :field1 {{t1}}',
//             addons: {
//                 t1: {
//                     sql: 'AND field2 = :field2',
//                     options: {propertyName: 'field2t'},
//                 },
//             },
//         };
//
//         await pq.query(query, {field1: 1, field2: 2}, {templateParams: {field2t: true}});
//         expect(client.query.mock.calls[0][0]).toBe('SELECT * FROM table WHERE field1 = $1 AND field2 = $2');
//         expect(client.query.mock.calls[0][1]).toMatchObject([1, 2]);
//     });
//
//     test('should handle simple query without template params', async () => {
//         const query = {
//             sql: 'SELECT * FROM table WHERE field1 = :field1 {{t1}}',
//             addons: {
//                 t1: {
//                     sql: 'AND field2 = :field2',
//                     options: {propertyName: 'field2'},
//                 },
//             },
//         };
//
//         await pq.query(query, {field1: 1, field2: 2});
//         expect(client.query.mock.calls[0][0]).toBe('SELECT * FROM table WHERE field1 = $1 AND field2 = $2');
//         expect(client.query.mock.calls[0][1]).toMatchObject([1, 2]);
//     });
//
//     test('should handle simple query without templates', async () => {
//         const query = {
//             sql: 'SELECT * FROM table WHERE field1 = :field1',
//         };
//
//         await pq.query(query, {field1: 1, field2: 2});
//         expect(client.query.mock.calls[0][0]).toBe('SELECT * FROM table WHERE field1 = $1');
//         expect(client.query.mock.calls[0][1]).toMatchObject([1]);
//     });
//
//     test('should throw on invalid query format', async () => {
//         const query = {
//             addons: {
//                 t1: {
//                     sql: 'AND field2 = :field2',
//                     options: {propertyName: 'field2'},
//                 },
//             },
//         };
//
//         expect(() => pq.query(query, {field1: 1, field2: 2})).toThrow(/sql/);
//     });
// });
const PostgresConnection = require('../connections/postgres-connection.js');
const sinon = require('sinon');
const assert = require('assert');
const {expect} = require('chai');

describe('PostgresConnection', () => {
    const client = {
        query: () => new Promise(resolve => resolve({rows: [{a: 1}]})),
    };

    const querySpy = sinon.spy(client, 'query');

    beforeEach(() => {
        querySpy.resetHistory();
    });

    const pq = new PostgresConnection({
        client,
        type: 'pg',
    });

    describe('class', () => {
        it('should have "query" function', () => {
            expect(pq.query).to.be.instanceOf(Function);
        });
        it('should have "transaction" function', () => {
            expect(pq.transaction).to.be.instanceOf(Function);
        });
        it('should have "commit" function', () => {
            expect(pq.commit).to.be.instanceOf(Function);
        });
        it('should have "rollback" function', () => {
            expect(pq.rollback).to.be.instanceOf(Function);
        });
        it('should have "rawQuery" function', () => {
            expect(pq.rawQuery).to.be.instanceOf(Function);
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

            await pq.query(query, {field1: 1, field2: 2}, {templateParams: {field2t: true}});
            expect(querySpy.lastCall.args[0]).to.be.equal('SELECT * FROM table WHERE field1 = $1 AND field2 = $2');
            expect(querySpy.lastCall.args[1]).to.be.deep.equal([1, 2]);
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

            await pq.query(query, {field1: 1, field2: 2});
            expect(querySpy.lastCall.args[0]).to.be.equal('SELECT * FROM table WHERE field1 = $1 AND field2 = $2');
            expect(querySpy.lastCall.args[1]).to.be.deep.equal([1, 2]);
        });

        it('should handle simple query without templates', async () => {
            const query = {
                sql: 'SELECT * FROM table WHERE field1 = :field1',
            };

            await pq.query(query, {field1: 1, field2: 2});
            expect(querySpy.lastCall.args[0]).to.be.equal('SELECT * FROM table WHERE field1 = $1');
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

            expect(() => pq.query(query, {field1: 1, field2: 2})).to.throw(/sql/);
        });
    });
});
