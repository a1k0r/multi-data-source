/**
 * @class
 */
class QueryTemplater {
    constructor() {
        this.queryCache = new Map();
    }

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
