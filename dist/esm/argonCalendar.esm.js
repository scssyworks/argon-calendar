// Selector
const WRAP_ERROR = 'Cannot wrap "undefined" element';
// Calendar
const ACTIVE_CALENDAR_ERROR = 'There is an existing calendar on current element';
const WRAPPING_ELEMENT_ERROR = 'Function "calendarWrap" must return a valid HTML';
const ROOT_ELEMENT_ERROR = 'Function "calendarRoot" must return a valid root element HTML';
const BODY_ROOT_ELEMENT_ERROR = 'Function "calendarBodyRoot" must return a valid body root element HTML to render calendar correctly';
const DAY_ELEMENT_ERROR = 'Function "dayElement" must return a valid day element HTML';
const MONTH_ELEMENT_ERROR = 'Function "monthElement" must return a valid month element HTML';
const DATE_ELEMENT_ERROR = 'Function "dateElement" must return a valid date element HTML';
const DAY_INDEX_ERROR = 'Please select a day between [0,6] where 0 = "Sunday" and 6 = "Saturday"';
const RANGE_SELECTION_ERROR = 'To use this feature set "rangeSelection" to true';
const DATE_SELECTION_ERROR = 'To use this feature set "rangeSelection" to false';
const SWAP_WARNING = 'Swapping start date with end date as current end date is smaller than start date.';
// Calendar HTML defaults
const CALENDARWRAP_HTML = `<div class="calendar-wrap"></div>`;
const CALENDARROOT_HTML = `<div class="calendar-root"></div>`;
const CALENDARHEADER_HTML = `<div class="calendar-header">
    This is a placeholder header. Use "calendarHeader()" method to customise calendar header
</div>`;
const CALENDARBODYROOT_HTML = `<div class="calendar-body-root"></div>`;
const CALENDARFOOTER_HTML = `<div class="calendar-footer">
    This is a placeholder footer. Use "calendarFooter()" method to customise calendar footer
</div>`;
const DAYELEMENT_HTML = `<div class="calendar-day">{{day}}</div>`;
const DATEELEMENT_HTML = `<button type="button" class="calendar-date">{{date}}</button>`;
const MONTHELEMENT_HTML = `<div class="calendar-month">{{month}}</div>`;
const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

function coerce(value) {
    switch (value) {
        case 'true': return true;
        case 'false': return false;
        case 'NaN': return NaN;
        case 'null':
        case 'NULL': return null;
        case 'undefined': return undefined;
        default:
            if (!isNaN(value)) {
                return +value;
            }
            return value;
    }
}

function isValidSelector(selector) {
    return (
        typeof selector === 'string'
        || selector instanceof Selector
        || selector instanceof Node
        || selector instanceof NodeList
        || Array.isArray(selector)
    );
}

function resolveData(data) {
    if (data && typeof data === 'object') {
        return JSON.stringify(data);
    }
    return data;
}

function restoreData(data) {
    if (typeof data === 'string') {
        try {
            const parsedData = JSON.parse(data);
            return parsedData;
        } catch (e) {
            /* Error in parsing JSON */
        }
    }
    return data;
}

function hiphenate(str) {
    let newStr = '';
    if (typeof str === 'string') {
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
                newStr += `-${str.charAt(i).toLowerCase()}`;
            } else {
                newStr += str.charAt(i);
            }
        }
    }
    return newStr;
}

class Selector {
    constructor(selectorRef, createMode) {
        this.length = 0;
        if (isValidSelector(selectorRef)) {
            if (typeof selectorRef === 'string') {
                const isHTML = selectorRef.trim().charAt(0) === '<';
                createMode = createMode || isHTML;
                if (createMode) {
                    // Create Mode
                    if (isHTML) {
                        const tempEl = document.createElement('div');
                        tempEl.innerHTML = selectorRef;
                        selectorRef = tempEl.childNodes;
                    } else {
                        const fragment = document.createDocumentFragment();
                        fragment.appendChild(document.createTextNode(selectorRef));
                        selectorRef = [fragment];
                    }
                } else {
                    selectorRef = document.querySelectorAll(selectorRef);
                }
            }
            if (selectorRef instanceof Node) {
                selectorRef = [selectorRef];
            }
            for (let i = 0; i < selectorRef.length; i++) {
                if ([1, 9, 11].indexOf(selectorRef[i].nodeType) > -1) {
                    this[this.length++] = selectorRef[i];
                }
            }
        }
    }
    html(text) {
        if (typeof text === 'undefined') {
            return this.map(ref => ref.innerHTML).join('');
        }
        if (text !== null) {
            this.each(ref => {
                ref.innerHTML = text.toString();
            });
        }
        return this;
    }
    outerHtml() {
        let htmlString = '';
        this.each(el => {
            htmlString += el.outerHTML + '\n';
        });
        return htmlString;
    }
    append(text) {
        this.each((ref, i) => {
            const selectorRef = (new Selector(text, typeof text === 'string')).clone(i === 0);
            selectorRef.each(el => {
                ref.appendChild(el);
            });
        });
        return this;
    }
    prepend(text) {
        const innerElements = this.children().detach();
        this.append(text).append(innerElements);
    }
    detach() {
        const fragment = document.createDocumentFragment();
        this.each(ref => {
            fragment.appendChild(ref);
        });
        return new Selector([fragment]);
    }
    children() {
        const allChildNodes = [];
        this.each(ref => {
            allChildNodes.push(...ref.childNodes);
        });
        return new Selector(allChildNodes);
    }
    filter(callback) {
        const newSelectorRef = new Selector();
        if (typeof callback === 'function') {
            this.each((ref, i) => {
                if (callback.apply(ref, [ref, i])) {
                    newSelectorRef[newSelectorRef.length++] = ref;
                }
            });
        }
        return newSelectorRef;
    }
    clone(doNotClone) {
        if (doNotClone) {
            return this;
        }
        return new Selector(this.map(ref => ref.cloneNode(true)));
    }
    map(callback) {
        const returnArr = [];
        if (typeof callback === 'function') {
            this.each((ref, i) => {
                returnArr.push(callback.apply(ref, [ref, i]));
            });
        }
        return returnArr;
    }
    each(callback) {
        if (typeof callback === 'function') {
            for (let i = 0; i < this.length; i++) {
                callback.apply(this[i], [this[i], i]);
            }
        }
        return this;
    }
    data(key, value) {
        if (arguments.length === 1) {
            if (typeof key === 'string') {
                return coerce(this.attr(`data-${hiphenate(key)}`));
            }
            if (key && typeof key === 'object') {
                const attrObject = {};
                Object.keys(key).forEach(attr => {
                    attrObject[`data-${hiphenate(attr)}`] = key[attr];
                });
                this.attr(attrObject);
            }
            return this;
        }
        if (arguments.length === 2) {
            this.attr(`data-${hiphenate(key)}`, value);
        }
        return this;
    }
    attr(key, value) {
        if (arguments.length === 1) {
            if (typeof key === 'string') {
                if (!this[0]) return;
                return restoreData(this[0].getAttribute(key));
            }
            if (key && typeof key === 'object') {
                Object.keys(key).forEach(attr => {
                    this[0].setAttribute(hiphenate(attr), resolveData(key[attr]));
                });
            }
            return this;
        }
        if (arguments.length === 2 && typeof key === 'string') {
            this[0].setAttribute(hiphenate(key), resolveData(value));
        }
        return this;
    }
    removeAttr(key) {
        this.each(el => {
            el.removeAttribute(key);
        });
        return this;
    }
    add(selector) {
        const selectorRef = new Selector(selector);
        selectorRef.each(ref => {
            if (!this.filter(fRef => fRef === ref).length) {
                this[this.length++] = ref;
            }
        });
        return this;
    }
    empty() {
        return this.html('');
    }
    wrap(containerHtml) {
        if (!this.length) {
            throw new TypeError(WRAP_ERROR);
        }
        const container = new WrapSelector(containerHtml);
        const thisParent = new Selector(this[0].parentNode);
        thisParent.prepend(container);
        container.append(this);
        return container;
    }
    addClass(classString) {
        if (typeof classString === 'string') {
            this.each(el => {
                el.classList.add(...classString.split(' ').filter(str => str.trim()));
            });
        }
        return this;
    }
    removeClass(classString) {
        if (typeof classString === 'string') {
            this.each(el => {
                el.classList.remove(...classString.split(' ').filter(str => str.trim()));
            });
        }
        return this;
    }
    hasClass(classString) {
        if (this.length && typeof classString === 'string') {
            return this[0].classList.contains(classString);
        }
        return false;
    }
    first() {
        return new Selector(this[0]);
    }
    remove() {
        this.each(el => {
            el.parentNode.removeChild(el);
        });
    }
    after(selectorRef) {
        const next = this.next().first();
        if (next.length) {
            next.before(selectorRef);
        } else {
            this.append(selectorRef);
        }
        return this;
    }
    before(selectorRef) {
        if (this.length) {
            (new Selector(selectorRef)).each(el => {
                this[0].parentNode.insertBefore(el, this[0]);
            });
        }
        return this;
    }
    next() {
        const newSelectorRef = new Selector();
        this.each(el => {
            if (el.nextSibling) {
                newSelectorRef.add(el.nextSibling);
            }
        });
        return newSelectorRef;
    }
}

class WrapSelector extends Selector {
    constructor(...args) {
        super(...args);
    }
    unwrap() {
        const ref = (new Selector(this[0])).after(this.children());
        this.remove();
        return ref;
    }
}

function $(...args) {
    return new Selector(...args);
}

function repl(str, keyMap) {
    Object.keys(keyMap).forEach(key => {
        const value = keyMap[key];
        if (typeof str === 'string') {
            str = str.replace((new RegExp(`{{${key}}}`, 'g')), value);
        }
    });
    return str;
}

function daysInMonth(monthNumber, year) {
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

function exact(currentDate, referenceDate) {
    return (
        currentDate.getDate() === referenceDate.getDate()
        && currentDate.getMonth() === referenceDate.getMonth()
        && currentDate.getYear() === referenceDate.getYear()
    );
}

function inRange(currentDate, startDate, endDate) {
    const currentTime = currentDate.getTime();
    return currentTime > startDate.getTime() && currentTime < endDate.getTime();
}

function calendarWrap() {
    return CALENDARWRAP_HTML;
}

function calendarRoot() {
    return CALENDARROOT_HTML;
}

function calendarHeader() {
    return CALENDARHEADER_HTML;
}

function calendarBodyRoot() {
    return CALENDARBODYROOT_HTML;
}

function calendarFooter() {
    return CALENDARFOOTER_HTML;
}

function dayElement(day) {
    return repl(DAYELEMENT_HTML, { day });
}

function monthElement(month) {
    return repl(MONTHELEMENT_HTML, { month });
}

function dateElement(date, current) {
    const dateEl = $(repl(DATEELEMENT_HTML, { date }));
    if (exact(this.today, current)) {
        dateEl.addClass('is-today');
    }
    if (this.config.rangeSelection) {
        if (this.startSelectionDate && exact(this.startSelectionDate, current)) {
            dateEl.addClass('is-start-date is-in-range');
        }
        if (this.endSelectionDate && exact(this.endSelectionDate, current)) {
            dateEl.addClass('is-end-date is-in-range');
        }
        if (
            this.startSelectionDate
            && this.endSelectionDate
            && inRange(current, this.startSelectionDate, this.endSelectionDate)
        ) {
            dateEl.addClass('is-in-range');
        }
    } else if (this.currentDate && exact(this.currentDate, current)) {
        dateEl.addClass('is-current-date');
    }
    return dateEl.outerHtml();
}

/**
 * Returns true if argument is object
 * @param {*} arg Argument
 */
function isObject(arg) {
    return arg && typeof arg === 'object';
}

/**
 * Inner loop function for assign
 * @private
 * @param {object} ref Argument object
 * @param {object} target First object
 */
function loopFunc(ref, target) {
    if (isObject(ref)) {
        Object.keys(ref).forEach(function (key) {
            target[key] = ref[key];
        });
    }
}

/**
 * Polyfill for Object.assign only smaller and with less features
 * @private
 * @returns {object}
 */
function assign() {
    const target = isObject(arguments[0]) ? arguments[0] : {};
    for (let i = 1; i < arguments.length; i++) {
        loopFunc(arguments[i], target);
    }
    return target;
}

class ArgonCalendar {
    constructor(config = {}) {
        this.config = Object.freeze(assign({
            target: document.body,
            weekStartsFrom: 0,
            numberOfCalendars: 1,
            rangeSelection: false,
            calendarWrap,
            calendarRoot,
            calendarHeader,
            calendarBodyRoot,
            calendarFooter,
            dayElement,
            monthElement,
            dateElement
        }, config));
        if (this.config.weekStartsFrom >= 7 || this.config.weekStartsFrom < 0) {
            throw new Error(DAY_INDEX_ERROR);
        }
        this.daysTransformed = DAYS.slice(this.config.weekStartsFrom).concat(DAYS.slice(0, this.config.weekStartsFrom));
        this.monthsTransformed = MONTHS;
        this.today = new Date();
        this._drawCalendar();
    }
    _drawCalendar() {
        const config = this.config;
        this.currentTarget = $(config.target).first();
        if (this.currentTarget.data('calendarActive')) {
            throw new Error(ACTIVE_CALENDAR_ERROR);
        }
        this.calTarget = this.currentTarget;
        this.currentTarget.data('calendarActive', true);
        const isCurrentTargetInput = this.currentTarget[0].nodeName === 'INPUT';
        const wrapCurrentTarget = this.config.wrapTarget || isCurrentTargetInput;
        if (wrapCurrentTarget) {
            try {
                this.calTarget = this.currentTarget.wrap(config.calendarWrap()).addClass('calendar-wrap');
                this.currentTarget.addClass(isCurrentTargetInput ? 'calendar-input' : 'calendar-wrapped');
                if (this.calTarget.length === 0) {
                    throw new Error(WRAPPING_ELEMENT_ERROR);
                }
            } catch (e) {
                throw new Error(e.message);
            }
        }
        this.calRoot = $(config.calendarRoot());
        if (this.calRoot.length) {
            this.calTarget.append(this.calRoot.addClass('calendar-root'));
            if (config.showHeader) {
                this.calRoot.append($(config.calendarHeader()).addClass('calendar-header'));
            }
            this.calBody = $(config.calendarBodyRoot()).addClass('calendar-body-root');
            if (this.calBody.length === 0) {
                throw new Error(BODY_ROOT_ELEMENT_ERROR);
            }
            this.calRoot.append(this.calBody);
            if (config.showFooter) {
                this.calRoot.append($(config.calendarFooter()).addClass('calendar-footer'));
            }
            this._drawMonths();
        } else {
            throw new Error(ROOT_ELEMENT_ERROR);
        }
    }
    _drawMonths(dateRef) {
        this.calBody.empty();
        const current = dateRef || (new Date());
        current.setDate(1);
        this.startMonthDate = current;
        let index = 0;
        while (index < this.config.numberOfCalendars) {
            const calMonth = $('<div class="calendar-month"></div>');
            try {
                calMonth.append(this.config.monthElement(this.monthsTransformed[current.getMonth()], current));
            } catch (e) {
                throw new Error(MONTH_ELEMENT_ERROR);
            }
            try {
                calMonth.append(`<div class="calendar-days-wrap">${this.daysTransformed.map(this.config.dayElement).join('')}</div>`);
            } catch (e) {
                throw new Error(DAY_ELEMENT_ERROR);
            }
            const calDatesWrap = $('<div class="calendar-dates-wrap"></div>');
            calMonth.append(calDatesWrap);
            this.calBody.append(calMonth);
            this._drawDates(calDatesWrap, current);
            index += 1;
            current.setDate(1);
            current.setMonth(current.getMonth() + 1);
        }
    }
    _drawDates(calDatesWrap, current) { // eslint-disable-line
        const totalDays = daysInMonth(current.getMonth(), current.getFullYear());
        let startPadding = current.getDay() - DAYS.indexOf(this.daysTransformed[0]);
        if (startPadding < 0) {
            startPadding = 7 - Math.abs(startPadding);
        }
        try {
            for (let i = 0; i < startPadding; i++) {
                const targetDate = current.getDate() - startPadding + i;
                const prevDate = new Date(current.getFullYear(), current.getMonth(), targetDate);
                calDatesWrap.append($(this.config.dateElement.apply(this, [prevDate.getDate(), prevDate])).addClass('calendar-date-prev'));
            }
            for (let i = 1; i <= totalDays; i++) {
                current.setDate(i);
                calDatesWrap.append(this.config.dateElement.apply(this, [i, current]));
            }
            let endPadding = DAYS.indexOf(this.daysTransformed[6]) - current.getDay();
            if (endPadding < 0) {
                endPadding = 7 - Math.abs(endPadding);
            }
            for (let i = 0; i < endPadding; i++) {
                const targetDate = current.getDate() + i + 1;
                const nextDate = new Date(current.getFullYear(), current.getMonth(), targetDate);
                calDatesWrap.append($(this.config.dateElement.apply(this, [nextDate.getDate(), nextDate])).addClass('calendar-date-next'));
            }
        } catch (e) {
            throw new Error(DATE_ELEMENT_ERROR);
        }
    }
    // Public methods
    destroy() {
        this.currentTarget.removeClass('calendar-input calendar-wrapped').removeAttr('data-calendar-active');
        if (this.calTarget.unwrap) {
            this.calTarget.unwrap();
        }
        this.calRoot.remove();
        return this;
    }
    next(skip = 1) {
        const numberOfCalendars = +this.config.numberOfCalendars;
        this.startMonthDate.setMonth(this.startMonthDate.getMonth() - numberOfCalendars + skip);
        this._drawMonths(this.startMonthDate);
        return this;
    }
    prev(skip = 1) {
        const numberOfCalendars = +this.config.numberOfCalendars;
        this.startMonthDate.setMonth(this.startMonthDate.getMonth() - numberOfCalendars - skip);
        this._drawMonths(this.startMonthDate);
        return this;
    }
    setDate(date) {
        if (!this.config.rangeSelection) {
            this.currentDate = date instanceof Date ? date : new Date(...arguments);
            this._drawMonths(new Date(this.currentDate.valueOf()));
        } else {
            throw new Error(DATE_SELECTION_ERROR);
        }
        return this;
    }
    getDate() {
        if (this.config.rangeSelection) {
            throw new Error(DATE_SELECTION_ERROR);
        }
        return new Date((this.currentDate || this.today).valueOf());
    }
    getToday() {
        return new Date(this.today.valueOf());
    }
    setStartDate(date) {
        if (this.config.rangeSelection) {
            this.startSelectionDate = date instanceof Date
                ? new Date(date.valueOf())
                : new Date(...arguments);
            this.endSelectionDate = new Date(this.startSelectionDate.valueOf());
        } else {
            throw new Error(RANGE_SELECTION_ERROR);
        }
        return this;
    }
    setEndDate(date) {
        if (this.config.rangeSelection) {
            this.endSelectionDate = date instanceof Date
                ? new Date(date.valueOf())
                : new Date(...arguments);
            if (!this.startSelectionDate) {
                this.startSelectionDate = new Date(this.endSelectionDate.valueOf());
            }
            if (
                this.startSelectionDate
                && this.endSelectionDate.getTime() < this.startSelectionDate.getTime()
            ) {
                console.warn(SWAP_WARNING);
                const endDate = new Date(this.startSelectionDate.valueOf());
                this.startSelectionDate = this.endSelectionDate;
                this.endSelectionDate = endDate;
            }
        } else {
            throw new Error(RANGE_SELECTION_ERROR);
        }
        return this;
    }
    getStartDate() {
        if (!this.config.rangeSelection) {
            throw new Error(RANGE_SELECTION_ERROR);
        }
        return new Date((this.startSelectionDate || this.today).valueOf());
    }
    getEndDate() {
        if (!this.config.rangeSelection) {
            throw new Error(RANGE_SELECTION_ERROR);
        }
        return new Date((this.endSelectionDate || this.today).valueOf());
    }
    jumpTo(date) {
        this._drawMonths((
            date instanceof Date
                ? new Date(date.valueOf())
                : new Date(...arguments)
        ));
        return this;
    }
}

export default ArgonCalendar;
//# sourceMappingURL=argonCalendar.esm.js.map
