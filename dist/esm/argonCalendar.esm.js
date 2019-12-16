
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
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
const YEARELEMENT_HTML = `<div class="calendar-year">{{year}}</div>`;
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

// Polyfill array includes
if (!Array.prototype.includes) {
    Array.prototype.includes = function (item) {
        return this.indexOf(item) > -1;
    };
}

// Polyfill custom event
if (typeof window.CustomEvent === 'undefined') {
    const CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
}

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
                if ([1, 9, 11].includes(selectorRef[i].nodeType)) {
                    this[this.length++] = selectorRef[i];
                }
            }
        }
    }
    trigger(eventType, data) {
        this.each(ref => {
            const customEvent = new window.CustomEvent(eventType, {
                bubbles: true,
                cancelable: true,
                detail: (data || [])
            });
            ref.dispatchEvent(customEvent);
        });
        return this;
    }
    on(eventName, selector, data, callback, useCapture) {
        const $this = this;
        if (arguments.length === 2) {
            callback = selector;
            selector = undefined;
        }
        if (arguments.length === 3) {
            if (typeof data === 'boolean') {
                useCapture = data;
                callback = selector;
                selector = data = undefined;
            }
            if (typeof data === 'function') {
                callback = data;
                if (!isValidSelector(selector)) {
                    data = selector;
                    selector = undefined;
                } else {
                    data = undefined;
                }
            }
        }
        if (arguments.length === 4) {
            if (typeof callback === 'boolean') {
                useCapture = callback;
                callback = data;
                if (isValidSelector(selector)) {
                    data = undefined;
                } else {
                    data = selector;
                    selector = undefined;
                }
            }
        }
        this.each(ref => {
            ref.addEventListener(eventName, function (e) {
                e.data = data;
                let params = [e];
                if (Array.isArray(e.detail)) {
                    params = params.concat(e.detail);
                }
                if (selector) {
                    const selectorRef = $this.find(selector).add($this);
                    const refSelectors = selectorRef.has(e.target);
                    if (refSelectors.length) {
                        callback.apply(refSelectors[0], params);
                    }
                } else {
                    callback.apply(this, params);
                }
            }, useCapture);
        });
        return this;
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
    has(selector) {
        const selectorRef = new Selector(selector);
        const found = [];
        this.each(ref => {
            selectorRef.each(targetRef => {
                if ((ref === targetRef || ref.contains(targetRef)) && !found.includes(ref)) {
                    found.push(ref);
                }
            });
        });
        return new Selector(found);
    }
    contains(selector) {
        return this.has(selector).length > 0;
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
    find(selector) {
        const found = [];
        if (typeof selector === 'string') {
            this.each(ref => {
                const selected = new Selector(ref.querySelectorAll(selector));
                selected.each(selectedRef => {
                    if (!found.includes(selectedRef)) {
                        found.push(selectedRef);
                    }
                });
            });
        }
        return new Selector(found);
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
    prev() {
        const newSelectorRef = new Selector();
        this.each(el => {
            if (el.previousSibling) {
                newSelectorRef.add(el.previousSibling);
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

$.extend = function () {
    return assign.apply(this, arguments);
};

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

class ArgonCalendar {
    constructor(config = {}) {
        this.config = Object.freeze($.extend({
            target: document.body,
            weekStartsFrom: 0,
            numberOfCalendars: 1,
            calendarWrap() {
                return CALENDARWRAP_HTML;
            },
            calendarRoot() {
                return CALENDARROOT_HTML;
            },
            calendarHeader() {
                return CALENDARHEADER_HTML;
            },
            calendarBodyRoot() {
                return CALENDARBODYROOT_HTML;
            },
            calendarFooter() {
                return CALENDARFOOTER_HTML;
            },
            dayElement(day) {
                return repl(DAYELEMENT_HTML, { day });
            },
            monthElement(month) {
                return repl(MONTHELEMENT_HTML, { month });
            },
            dateElement(date) {
                return repl(DATEELEMENT_HTML, { date });
            },
            yearElement(year) {
                return repl(YEARELEMENT_HTML, { year });
            }
        }, config));
        if (this.config.weekStartsFrom >= 7 || this.config.weekStartsFrom < 0) {
            throw new Error(DAY_INDEX_ERROR);
        }
        this.daysTransformed = DAYS.slice(this.config.weekStartsFrom).concat(DAYS.slice(0, this.config.weekStartsFrom));
        this.monthsTransformed = MONTHS;
        this.drawCalendar();
    }
    drawCalendar() {
        const config = this.config;
        this.currentTarget = $(config.target).first();
        if (this.currentTarget.data('calendarActive')) {
            throw new Error(ACTIVE_CALENDAR_ERROR);
        }
        this.calTarget = this.currentTarget;
        this.currentTarget.data('calendarActive', true);
        if (this.currentTarget[0].nodeName === 'INPUT') {
            try {
                this.calTarget = this.currentTarget.wrap(config.calendarWrap()).addClass('calendar-wrap');
                this.currentTarget.addClass('calendar-input');
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
            this.drawMonths();
        } else {
            throw new Error(ROOT_ELEMENT_ERROR);
        }
    }
    drawMonths(dateRef) {
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
            this.drawDates(calDatesWrap, current);
            index += 1;
            current.setDate(1);
            current.setMonth(current.getMonth() + 1);
        }
    }
    drawDates(calDatesWrap, current) { // eslint-disable-line
        const totalDays = daysInMonth(current.getMonth(), current.getFullYear());
        let startPadding = current.getDay() - DAYS.indexOf(this.daysTransformed[0]);
        if (startPadding < 0) {
            startPadding = 7 - Math.abs(startPadding);
        }
        try {
            for (let i = 0; i < startPadding; i++) {
                const targetDate = current.getDate() - startPadding + i;
                const prevDate = new Date(current.getFullYear(), current.getMonth(), targetDate);
                calDatesWrap.append($(this.config.dateElement(prevDate.getDate(), prevDate)).addClass('calendar-date-prev'));
            }
            for (let i = 1; i <= totalDays; i++) {
                current.setDate(i);
                calDatesWrap.append(this.config.dateElement(i, current));
            }
            let endPadding = DAYS.indexOf(this.daysTransformed[6]) - current.getDay();
            if (endPadding < 0) {
                endPadding = 7 - Math.abs(endPadding);
            }
            for (let i = 0; i < endPadding; i++) {
                const targetDate = current.getDate() + i + 1;
                const nextDate = new Date(current.getFullYear(), current.getMonth(), targetDate);
                calDatesWrap.append($(this.config.dateElement(nextDate.getDate(), nextDate)).addClass('calendar-date-next'));
            }
        } catch (e) {
            throw new Error(DATE_ELEMENT_ERROR);
        }
    }
    // Public methods
    destroy() {
        this.currentTarget.removeClass('calendar-input').removeAttr('data-calendar-active');
        this.calTarget.unwrap();
        this.calRoot.remove();
    }
    next(skip = 1) {
        const numberOfCalendars = +this.config.numberOfCalendars;
        this.startMonthDate.setMonth(this.startMonthDate.getMonth() - numberOfCalendars + skip);
        this.drawMonths(this.startMonthDate);
    }
    prev(skip = 1) {
        const numberOfCalendars = +this.config.numberOfCalendars;
        this.startMonthDate.setMonth(this.startMonthDate.getMonth() - numberOfCalendars - skip);
        this.drawMonths(this.startMonthDate);
    }
}

window.ArgonCalendar = ArgonCalendar;
//# sourceMappingURL=argonCalendar.esm.js.map
