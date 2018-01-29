const util = require('util');
const fs = require('fs');
// const log = require('../../../../app/components/log')(module);

const readFile = util.promisify(fs.readFile);

/**
 * @class
 */
class QueryGetter {
    /**
     * @param {Object} config config
     */
    constructor(config) {
        this.config = config;
        this.nameRegex = config.nameRegex || /--(\ )\[(.+)\]\n/;
    }

    /**
     * @returns {Promise.<*>} query file
     */
    async fetchQueries() {
        const {fileName} = this.config;

        const queries = await readFile(fileName, 'utf8');

        return queries;
    }

    /**
     * @param {String} fetchedString file
     * @returns {Object} queries
     */
    parseQueries(fetchedString) {
        const rows = fetchedString.split(';\n');

        const result = {};

        for (const query of rows) {
            const queryName = query.match(this.nameRegex);

            if (queryName && queryName.length && queryName[2]) {
                const name = queryName[2];

                const preparedSQL = query.replace(this.nameRegex, '').trim();

                const sql = `${preparedSQL};`;

                result[name] = sql;
            }
        }
        // log.info(`Loaded ${Object.keys(result).length} queries from ${this.config.fileName}`);
        // log.silly(`Queries: ${Object.keys(result)}`);
        return result;
    }

    /**
     * @returns {Promise.<Object>} parsed queries
     */
    async getQueries() {
        const fetchedString = await this.fetchQueries();
        return this.parseQueries(fetchedString);
    }
}

module.exports = QueryGetter;
