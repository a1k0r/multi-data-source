const QueryGetter = require('./QueryGetter');
const QueryTemplater = require('./QueryTemplater');
const escapeParams = require('./escapeParams');
module.exports = {
    QueryGetter,
    escapeParams,
    QueryTemplater,
};

// TODO: (\/\*\*)@([a-zA-Z_\-0-9]*)\*([a-zA-Z\+\-\=_\'\"? \n$]*)(\*\/) -- may be regex for additions
// TODO: example:  /**@raceID*AND race_id = ? */
