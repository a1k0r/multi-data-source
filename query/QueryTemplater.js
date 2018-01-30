/**
 * @class
 */
class QueryTemplater {
    /**
     * @constructor
     */
    constructor() {
        this.queryCache = new Map();
    }

    /**
     * @param {String} name queryName
     * @param {Object} buildParams queryTemplateParams
     * @param {String} sql queryText
     * @param {Object} addons queryTemplateAddons
     * @returns {String} built query
     */
    buildQuery({name, sql, addons}, buildParams) {
        let builtQuery;
        const queryKey = JSON.stringify({name, buildParams});
        if (this.queryCache.has(queryKey)) {
            builtQuery = this.queryCache.get(queryKey);
        } else {
            builtQuery = sql;
            for (const add of Object.keys(addons)) {
                const {arg: {name, value}, sql} = addons[add];
                builtQuery = builtQuery.replace(`{{${add}}}`, !!buildParams[name] === value ? sql : '');
            }
            this.queryCache.set(queryKey, builtQuery);
        }
        return builtQuery;
    }
}

module.exports = new QueryTemplater();
