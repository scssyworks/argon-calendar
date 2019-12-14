import { assign } from '../Assign';

// Polyfill array includes
if (!Array.prototype.includes) {
    Array.prototype.includes = function (item) {
        return this.indexOf(item) > -1;
    }
}

// Polyfill custom event
if (typeof window.CustomEvent === 'undefined') {
    const CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
}

export function coerce(value) {
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

export function isValidSelector(selector) {
    return (
        typeof selector === 'string'
        || selector instanceof Selector
        || selector instanceof Node
        || selector instanceof NodeList
        || Array.isArray(selector)
    );
}

export function resolveData(data) {
    if (data && typeof data === 'object') {
        return JSON.stringify(data);
    }
    return data;
}

export function restoreData(data) {
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

export function hiphenate(str) {
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

export function camelize(str) {
    if (typeof str === 'string') {
        const newStr = str.split('-').map(s => (s.charAt(0).toUpperCase() + s.substring(1))).join('');
        return (newStr.charAt(0).toLowerCase() + newStr.substring(1));
    }
    return '';
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
        if (typeof classString === 'string') {
            return this[0].classList.contains(classString);
        }
        return false;
    }
    first() {
        return new Selector(this[0]);
    }
}

function isReady(callback) {
    return ['complete', 'interactive'].includes(this.readyState()) && typeof callback === 'function';
}

class DocumentSelector extends Selector {
    constructor(...args) {
        super(...args);
    }
    ready(callback) {
        if (isReady.apply(this, [callback])) {
            setTimeout(callback.bind(this[0]), 0);
        } else {
            this.on('DOMContentLoaded', () => {
                if (isReady.apply(this, [callback])) {
                    callback.apply(this[0]);
                }
            });
        }
        return this;
    }
    readyState() {
        return this[0].readyState;
    }
}

class WrapSelector extends Selector {
    constructor(...args) {
        super(...args);
    }
    unwrap() {
        return (new Selector(this[0].parentNode)).append(this.children());
    }
}

function $() {
    let args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'function') {
        const callback = args[0];
        args = [document];
        return (new DocumentSelector(...args)).ready(callback);
    }
    if (arguments[0] === document) {
        return new DocumentSelector(...args);
    }
    return new Selector(...args);
}

$.extend = function () {
    return assign.apply(this, arguments);
}

export { $ };