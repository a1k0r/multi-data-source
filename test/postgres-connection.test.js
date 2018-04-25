// const jest = require('jest');
const PostgresConnection = require('../connections/postgres-connection.js');

describe('Postgres connection', () => {
    const client = {
        query: jest.fn((query, params) => Promise.resolve({query, params})),
    };

    beforeEach(() => {
        client.query.mockClear();
    });

    const pq = new PostgresConnection({
        client,
        type: 'pg',
    });

    test('should handle simple query with right format', async () => {
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
        expect(client.query.mock.calls[0][0]).toBe('SELECT * FROM table WHERE field1 = $1 AND field2 = $2');
        expect(client.query.mock.calls[0][1]).toMatchObject([1, 2]);
    });

    test('should handle simple query without template params', async () => {
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
        expect(client.query.mock.calls[0][0]).toBe('SELECT * FROM table WHERE field1 = $1 AND field2 = $2');
        expect(client.query.mock.calls[0][1]).toMatchObject([1, 2]);
    });

    test('should handle simple query without templates', async () => {
        const query = {
            sql: 'SELECT * FROM table WHERE field1 = :field1',
        };

        await pq.query(query, {field1: 1, field2: 2});
        expect(client.query.mock.calls[0][0]).toBe('SELECT * FROM table WHERE field1 = $1');
        expect(client.query.mock.calls[0][1]).toMatchObject([1]);
    });

    test('should throw on invalid query format', async () => {
        const query = {
            addons: {
                t1: {
                    sql: 'AND field2 = :field2',
                    options: {propertyName: 'field2'},
                },
            },
        };

        expect(() => pq.query(query, {field1: 1, field2: 2})).toThrow(/sql/);
    });
});
