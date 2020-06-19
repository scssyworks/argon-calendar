import { WRAP_ERROR } from '../Constants';

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

class Selector {
    constructor(selectorRef, createMode) {
        this.length = 0;
        this.listeners = [];
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
    map(callback = ((el) => el)) {
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
    on(eventType, delegateSelector, callback, useCapture) {
        if (typeof delegateSelector === 'function') {
            useCapture = callback;
            callback = delegateSelector;
            delegateSelector = undefined;
        }
        this.each(el => {
            const listener = (e) => {
                if (delegateSelector) {
                    const children = (new Selector(delegateSelector)).map();
                    let selected = null;
                    for (const node of children) {
                        if (e.target.contains(node)) {
                            selected = node;
                            break;
                        }
                    }
                    if (selected && typeof callback === 'function') {
                        callback.apply(selected, [e]);
                    }
                } else if (typeof callback === 'function') {
                    callback.apply(el, [e]);
                }
            };
            this.listeners.push({ el, eventType, listener, useCapture });
            el.addEventListener(eventType, listener, useCapture);
        });
        return this;
    }
    off() {
        while (this.listeners.length > 0) {
            const { el, eventType, listener, useCapture } = this.listeners.pop();
            el.removeEventListener(eventType, listener, useCapture);
        }
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

export function $(...args) {
    return new Selector(...args);
}