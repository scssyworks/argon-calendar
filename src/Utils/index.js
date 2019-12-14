export function repl(str, keyMap) {
    Object.keys(keyMap).forEach(key => {
        const value = keyMap[key];
        if (typeof str === 'string') {
            str = str.replace((new RegExp(`{{${key}}}`, 'g')), value);
        }
    });
    return str;
}

export function daysInMonth(monthNumber, year) {
    const dateObject = new Date();
    dateObject.setFullYear(year);
    dateObject.setMonth(monthNumber);
    dateObject.setDate(31);
    if (dateObject.getDate() === 31) {
        return 31;
    } else {
        dateObject.setDate(31 - dateObject.getDate());
        return dateObject.getDate();
    }
}