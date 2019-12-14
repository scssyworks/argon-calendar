export function repl(str, keyMap) {
    Object.keys(keyMap).forEach(key => {
        const value = keyMap[key];
        if (typeof str === 'string') {
            str = str.replace((new RegExp(`{{${key}}}`, 'g')), value);
        }
    });
    return str;
}