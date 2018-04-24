# multi-data-source
> Node.js library which helps developers to manage multiple RDBMS connections to different databases

[![NPM Version][npm-image]][npm-url]

## Installation

```sh
npm install multi-data-source
```

## Features

* Multiple data sources support
* Multiple RDBMS support (only PostgreSQL for now, but you feel free to contribute your own connector to favorite RDBMS)
* Single interface to pass query parameters to multiple RDBMS with param escaping module


## Dependencies

* [pg](https://github.com/brianc/node-postgres) -- Used to handle postgres connection

## Usage example

### Storage config example

```js
const config = {
    'postgres': {
        'host': '127.0.0.1',
        'port': 5432,
        'database': 'postgres',
        'user': 'postgres',
        'password': '',
        'storageType': 'pg',
    },
};

const storage = new Storage(config);
```

### Query definition example

```js
const getUsersByScore = {
    name: 'getUsersByScore',
    sql: `
        SELECT id {{nickname}}
          FROM users
          WHERE score > :score
            {{balance}}
        `,
    addons: {
        noGlobalJoin: {
            arg: {name: 'global', value: false},
            sql: 'INNER JOIN mega_jackpot_halls AS mjh USING(hall_id)',
        },
        nickname: {
            arg: {name: 'needNickname', value: true},
            sql: ', nickname',
        },
        balance: {
            arg: {name: 'balanceCondition', value: true},
            sql: 'AND balance >= :balance',
        },
    },
};
```

### Query execution example

```js
let connection;
try {
    connection = await storage.getConnection('postgres');

    const data = await connection.query(getUsersByScore,
        {
            score: 100,
            balance: 50,
        },
        {
            templateParams: {balanceCondition: true},
        }
    );
    console.log(data);
} catch (error) {
    console.error(error);
} finally {
    if (connection) {
        await connection.release;
    }
}
```

## Author

Pavel Romanov -- alkor@alkor.pw -- [GitHub](https://github.com/Shikyaro)

## License

Distributed under MIT License. See [`LICENSE`](./LICENSE) for more information;

[npm-image]: https://img.shields.io/npm/v/multi-data-source.svg?style=flat-square
[npm-url]: https://npmjs.org/package/multi-data-source