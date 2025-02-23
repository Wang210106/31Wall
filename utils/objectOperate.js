function containsEmptyItem(obj) {
    if (obj === null || typeof obj !== 'object') {
        throw new TypeError('Expected an object');
    }
 
    function isEmptyValue(value) {
        return value === null ||
               value === undefined ||
               value === '' ||
               Number.isNaN(value) ||
               (Array.isArray(value) && value.length === 0) ||
               (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0);
    }
 
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && isEmptyValue(obj[key])) {
            return true; // 只要有一个空项就返回 true
        }
    }
 
    return false; // 如果没有空项，则返回 false
}

module.exports = {
    containsEmptyItem,
}
