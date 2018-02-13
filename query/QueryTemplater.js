const escapeParams = require('./escapeParams.js');
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
     * @param {String} query query
     * @param {String} addon addon
     * @param {*} buildParam buildParam
     * @param {Boolean} value value
     * @param {String} sql sql
     * @returns {string | void | *} built query
     * @private
     */
    _processCommonTemplate(query, addon, buildParam, value, sql) {
        return query.replace(`{{${addon}}}`, !!buildParam === value ? sql : '');
    }

    /**
     * @param {String} query query
     * @param {String} addon addon
     * @param {*} buildParam buildParam
     * @param {String} delimiter delimiter
     * @param {String} sql sql
     * @returns {string | void | *} built query
     * @private
     */
    _processCyclicTemplate(query, addon, buildParam, delimiter, sql) {
        const replacementString = buildParam.reduce((res, paramObject, id) => {
            if (typeof (paramObject) === 'object') {
                res += ` ${id ? delimiter : ''} ${escapeParams(sql, paramObject)}`; // eslint-disable-line no-param-reassign
            }

            return res;
        }, '');

        return query.replace(`{{${addon}}}`, replacementString);
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
                const {arg: {name, value}, sql, delimiter} = addons[add];
                const param = buildParams[name];
                if (Array.isArray(param)) {
                    builtQuery = this._processCyclicTemplate(builtQuery, add, param, delimiter, sql);
                } else {
                    builtQuery = this._processCommonTemplate(builtQuery, add, param, value, sql);
                }
            }
            this.queryCache.set(queryKey, builtQuery);
        }
        return builtQuery;
    }
}

module.exports = new QueryTemplater();
