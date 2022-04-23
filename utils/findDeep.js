// find property in object
export default function findDeep(obj, key) {
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object') {
            const result = findDeep(obj[prop], key);
            if (result) {
                return result;
            }
        }
    }
    return undefined;
}
