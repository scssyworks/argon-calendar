(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.argonCalendar = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  // Selector
  var WRAP_ERROR = 'Cannot wrap "undefined" element'; // Calendar

  var ACTIVE_CALENDAR_ERROR = 'There is an existing calendar on current element';
  var WRAPPING_ELEMENT_ERROR = 'Function "calendarWrap" must return a valid HTML';
  var ROOT_ELEMENT_ERROR = 'Function "calendarRoot" must return a valid root element HTML';
  var BODY_ROOT_ELEMENT_ERROR = 'Function "calendarBodyRoot" must return a valid body root element HTML to render calendar correctly';
  var DAY_ELEMENT_ERROR = 'Function "dayElement" must return a valid day element HTML';
  var MONTH_ELEMENT_ERROR = 'Function "monthElement" must return a valid month element HTML';
  var DATE_ELEMENT_ERROR = 'Function "dateElement" must return a valid date element HTML';
  var DAY_INDEX_ERROR = 'Please select a day between [0,6] where 0 = "Sunday" and 6 = "Saturday"';
  var RANGE_SELECTION_ERROR = 'To use this feature set "rangeSelection" to true';
  var DATE_SELECTION_ERROR = 'To use this feature set "rangeSelection" to false';
  var SWAP_WARNING = 'Swapping start date with end date as current end date is smaller than start date.'; // Calendar HTML defaults

  var CALENDARWRAP_HTML = "<div class=\"calendar-wrap\"></div>";
  var CALENDARROOT_HTML = "<div class=\"calendar-root\"></div>";
  var CALENDARHEADER_HTML = "<div class=\"calendar-header\">\n    This is a placeholder header. Use \"calendarHeader()\" method to customise calendar header\n</div>";
  var CALENDARBODYROOT_HTML = "<div class=\"calendar-body-root\"></div>";
  var CALENDARFOOTER_HTML = "<div class=\"calendar-footer\">\n    This is a placeholder footer. Use \"calendarFooter()\" method to customise calendar footer\n</div>";
  var DAYELEMENT_HTML = "<div class=\"calendar-day\">{{day}}</div>";
  var DATEELEMENT_HTML = "<button type=\"button\" class=\"calendar-date\">{{date}}</button>";
  var MONTHELEMENT_HTML = "<div class=\"calendar-month\">{{month}}</div>";
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function coerce(value) {
    switch (value) {
      case 'true':
        return true;

      case 'false':
        return false;

      case 'NaN':
        return NaN;

      case 'null':
      case 'NULL':
        return null;

      case 'undefined':
        return undefined;

      default:
        if (!isNaN(value)) {
          return +value;
        }

        return value;
    }
  }
  function isValidSelector(selector) {
    return typeof selector === 'string' || selector instanceof Selector || selector instanceof Node || selector instanceof NodeList || Array.isArray(selector);
  }
  function resolveData(data) {
    if (data && _typeof(data) === 'object') {
      return JSON.stringify(data);
    }

    return data;
  }
  function restoreData(data) {
    if (typeof data === 'string') {
      try {
        var parsedData = JSON.parse(data);
        return parsedData;
      } catch (e) {
        /* Error in parsing JSON */
      }
    }

    return data;
  }
  function hiphenate(str) {
    var newStr = '';

    if (typeof str === 'string') {
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
          newStr += "-".concat(str.charAt(i).toLowerCase());
        } else {
          newStr += str.charAt(i);
        }
      }
    }

    return newStr;
  }

  var Selector =
  /*#__PURE__*/
  function () {
    function Selector(selectorRef, createMode) {
      _classCallCheck(this, Selector);

      this.length = 0;

      if (isValidSelector(selectorRef)) {
        if (typeof selectorRef === 'string') {
          var isHTML = selectorRef.trim().charAt(0) === '<';
          createMode = createMode || isHTML;

          if (createMode) {
            // Create Mode
            if (isHTML) {
              var tempEl = document.createElement('div');
              tempEl.innerHTML = selectorRef;
              selectorRef = tempEl.childNodes;
            } else {
              var fragment = document.createDocumentFragment();
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

        for (var i = 0; i < selectorRef.length; i++) {
          if ([1, 9, 11].indexOf(selectorRef[i].nodeType) > -1) {
            this[this.length++] = selectorRef[i];
          }
        }
      }
    }

    _createClass(Selector, [{
      key: "html",
      value: function html(text) {
        if (typeof text === 'undefined') {
          return this.map(function (ref) {
            return ref.innerHTML;
          }).join('');
        }

        if (text !== null) {
          this.each(function (ref) {
            ref.innerHTML = text.toString();
          });
        }

        return this;
      }
    }, {
      key: "outerHtml",
      value: function outerHtml() {
        var htmlString = '';
        this.each(function (el) {
          htmlString += el.outerHTML + '\n';
        });
        return htmlString;
      }
    }, {
      key: "append",
      value: function append(text) {
        this.each(function (ref, i) {
          var selectorRef = new Selector(text, typeof text === 'string').clone(i === 0);
          selectorRef.each(function (el) {
            ref.appendChild(el);
          });
        });
        return this;
      }
    }, {
      key: "prepend",
      value: function prepend(text) {
        var innerElements = this.children().detach();
        this.append(text).append(innerElements);
      }
    }, {
      key: "detach",
      value: function detach() {
        var fragment = document.createDocumentFragment();
        this.each(function (ref) {
          fragment.appendChild(ref);
        });
        return new Selector([fragment]);
      }
    }, {
      key: "children",
      value: function children() {
        var allChildNodes = [];
        this.each(function (ref) {
          allChildNodes.push.apply(allChildNodes, _toConsumableArray(ref.childNodes));
        });
        return new Selector(allChildNodes);
      }
    }, {
      key: "filter",
      value: function filter(callback) {
        var newSelectorRef = new Selector();

        if (typeof callback === 'function') {
          this.each(function (ref, i) {
            if (callback.apply(ref, [ref, i])) {
              newSelectorRef[newSelectorRef.length++] = ref;
            }
          });
        }

        return newSelectorRef;
      }
    }, {
      key: "clone",
      value: function clone(doNotClone) {
        if (doNotClone) {
          return this;
        }

        return new Selector(this.map(function (ref) {
          return ref.cloneNode(true);
        }));
      }
    }, {
      key: "map",
      value: function map(callback) {
        var returnArr = [];

        if (typeof callback === 'function') {
          this.each(function (ref, i) {
            returnArr.push(callback.apply(ref, [ref, i]));
          });
        }

        return returnArr;
      }
    }, {
      key: "each",
      value: function each(callback) {
        if (typeof callback === 'function') {
          for (var i = 0; i < this.length; i++) {
            callback.apply(this[i], [this[i], i]);
          }
        }

        return this;
      }
    }, {
      key: "data",
      value: function data(key, value) {
        if (arguments.length === 1) {
          if (typeof key === 'string') {
            return coerce(this.attr("data-".concat(hiphenate(key))));
          }

          if (key && _typeof(key) === 'object') {
            var attrObject = {};
            Object.keys(key).forEach(function (attr) {
              attrObject["data-".concat(hiphenate(attr))] = key[attr];
            });
            this.attr(attrObject);
          }

          return this;
        }

        if (arguments.length === 2) {
          this.attr("data-".concat(hiphenate(key)), value);
        }

        return this;
      }
    }, {
      key: "attr",
      value: function attr(key, value) {
        var _this = this;

        if (arguments.length === 1) {
          if (typeof key === 'string') {
            if (!this[0]) return;
            return restoreData(this[0].getAttribute(key));
          }

          if (key && _typeof(key) === 'object') {
            Object.keys(key).forEach(function (attr) {
              _this[0].setAttribute(hiphenate(attr), resolveData(key[attr]));
            });
          }

          return this;
        }

        if (arguments.length === 2 && typeof key === 'string') {
          this[0].setAttribute(hiphenate(key), resolveData(value));
        }

        return this;
      }
    }, {
      key: "removeAttr",
      value: function removeAttr(key) {
        this.each(function (el) {
          el.removeAttribute(key);
        });
        return this;
      }
    }, {
      key: "add",
      value: function add(selector) {
        var _this2 = this;

        var selectorRef = new Selector(selector);
        selectorRef.each(function (ref) {
          if (!_this2.filter(function (fRef) {
            return fRef === ref;
          }).length) {
            _this2[_this2.length++] = ref;
          }
        });
        return this;
      }
    }, {
      key: "empty",
      value: function empty() {
        return this.html('');
      }
    }, {
      key: "wrap",
      value: function wrap(containerHtml) {
        if (!this.length) {
          throw new TypeError(WRAP_ERROR);
        }

        var container = new WrapSelector(containerHtml);
        var thisParent = new Selector(this[0].parentNode);
        thisParent.prepend(container);
        container.append(this);
        return container;
      }
    }, {
      key: "addClass",
      value: function addClass(classString) {
        if (typeof classString === 'string') {
          this.each(function (el) {
            var _el$classList;

            (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(classString.split(' ').filter(function (str) {
              return str.trim();
            })));
          });
        }

        return this;
      }
    }, {
      key: "removeClass",
      value: function removeClass(classString) {
        if (typeof classString === 'string') {
          this.each(function (el) {
            var _el$classList2;

            (_el$classList2 = el.classList).remove.apply(_el$classList2, _toConsumableArray(classString.split(' ').filter(function (str) {
              return str.trim();
            })));
          });
        }

        return this;
      }
    }, {
      key: "hasClass",
      value: function hasClass(classString) {
        if (this.length && typeof classString === 'string') {
          return this[0].classList.contains(classString);
        }

        return false;
      }
    }, {
      key: "first",
      value: function first() {
        return new Selector(this[0]);
      }
    }, {
      key: "remove",
      value: function remove() {
        this.each(function (el) {
          el.parentNode.removeChild(el);
        });
      }
    }, {
      key: "after",
      value: function after(selectorRef) {
        var next = this.next().first();

        if (next.length) {
          next.before(selectorRef);
        } else {
          this.append(selectorRef);
        }

        return this;
      }
    }, {
      key: "before",
      value: function before(selectorRef) {
        var _this3 = this;

        if (this.length) {
          new Selector(selectorRef).each(function (el) {
            _this3[0].parentNode.insertBefore(el, _this3[0]);
          });
        }

        return this;
      }
    }, {
      key: "next",
      value: function next() {
        var newSelectorRef = new Selector();
        this.each(function (el) {
          if (el.nextSibling) {
            newSelectorRef.add(el.nextSibling);
          }
        });
        return newSelectorRef;
      }
    }]);

    return Selector;
  }();

  var WrapSelector =
  /*#__PURE__*/
  function (_Selector) {
    _inherits(WrapSelector, _Selector);

    function WrapSelector() {
      var _getPrototypeOf2;

      _classCallCheck(this, WrapSelector);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WrapSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));
    }

    _createClass(WrapSelector, [{
      key: "unwrap",
      value: function unwrap() {
        var ref = new Selector(this[0]).after(this.children());
        this.remove();
        return ref;
      }
    }]);

    return WrapSelector;
  }(Selector);

  function $() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _construct(Selector, args);
  }

  function repl(str, keyMap) {
    Object.keys(keyMap).forEach(function (key) {
      var value = keyMap[key];

      if (typeof str === 'string') {
        str = str.replace(new RegExp("{{".concat(key, "}}"), 'g'), value);
      }
    });
    return str;
  }
  function daysInMonth(monthNumber, year) {
    var dateObject = new Date();
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
    return currentDate.getDate() === referenceDate.getDate() && currentDate.getMonth() === referenceDate.getMonth() && currentDate.getYear() === referenceDate.getYear();
  }

  function inRange(currentDate, startDate, endDate) {
    var currentTime = currentDate.getTime();
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
    return repl(DAYELEMENT_HTML, {
      day: day
    });
  }
  function monthElement(month) {
    return repl(MONTHELEMENT_HTML, {
      month: month
    });
  }
  function dateElement(date, current) {
    var dateEl = $(repl(DATEELEMENT_HTML, {
      date: date
    }));

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

      if (this.startSelectionDate && this.endSelectionDate && inRange(current, this.startSelectionDate, this.endSelectionDate)) {
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
    return arg && _typeof(arg) === 'object';
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
    var target = isObject(arguments[0]) ? arguments[0] : {};

    for (var i = 1; i < arguments.length; i++) {
      loopFunc(arguments[i], target);
    }

    return target;
  }

  var ArgonCalendar =
  /*#__PURE__*/
  function () {
    function ArgonCalendar() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ArgonCalendar);

      this.config = Object.freeze(assign({
        target: document.body,
        weekStartsFrom: 0,
        numberOfCalendars: 1,
        rangeSelection: false,
        calendarWrap: calendarWrap,
        calendarRoot: calendarRoot,
        calendarHeader: calendarHeader,
        calendarBodyRoot: calendarBodyRoot,
        calendarFooter: calendarFooter,
        dayElement: dayElement,
        monthElement: monthElement,
        dateElement: dateElement
      }, config));

      if (this.config.weekStartsFrom >= 7 || this.config.weekStartsFrom < 0) {
        throw new Error(DAY_INDEX_ERROR);
      }

      this.daysTransformed = DAYS.slice(this.config.weekStartsFrom).concat(DAYS.slice(0, this.config.weekStartsFrom));
      this.monthsTransformed = MONTHS;
      this.today = new Date();

      this._drawCalendar();
    }

    _createClass(ArgonCalendar, [{
      key: "_drawCalendar",
      value: function _drawCalendar() {
        var config = this.config;
        this.currentTarget = $(config.target).first();

        if (this.currentTarget.data('calendarActive')) {
          throw new Error(ACTIVE_CALENDAR_ERROR);
        }

        this.calTarget = this.currentTarget;
        this.currentTarget.data('calendarActive', true);
        var isCurrentTargetInput = this.currentTarget[0].nodeName === 'INPUT';
        var wrapCurrentTarget = this.config.wrapTarget || isCurrentTargetInput;

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
    }, {
      key: "_drawMonths",
      value: function _drawMonths(dateRef) {
        this.calBody.empty();
        var current = dateRef || new Date();
        current.setDate(1);
        this.startMonthDate = current;
        var index = 0;

        while (index < this.config.numberOfCalendars) {
          var calMonth = $('<div class="calendar-month"></div>');

          try {
            calMonth.append(this.config.monthElement(this.monthsTransformed[current.getMonth()], current));
          } catch (e) {
            throw new Error(MONTH_ELEMENT_ERROR);
          }

          try {
            calMonth.append("<div class=\"calendar-days-wrap\">".concat(this.daysTransformed.map(this.config.dayElement).join(''), "</div>"));
          } catch (e) {
            throw new Error(DAY_ELEMENT_ERROR);
          }

          var calDatesWrap = $('<div class="calendar-dates-wrap"></div>');
          calMonth.append(calDatesWrap);
          this.calBody.append(calMonth);

          this._drawDates(calDatesWrap, current);

          index += 1;
          current.setDate(1);
          current.setMonth(current.getMonth() + 1);
        }
      }
    }, {
      key: "_drawDates",
      value: function _drawDates(calDatesWrap, current) {
        // eslint-disable-line
        var totalDays = daysInMonth(current.getMonth(), current.getFullYear());
        var startPadding = current.getDay() - DAYS.indexOf(this.daysTransformed[0]);

        if (startPadding < 0) {
          startPadding = 7 - Math.abs(startPadding);
        }

        try {
          for (var i = 0; i < startPadding; i++) {
            var targetDate = current.getDate() - startPadding + i;
            var prevDate = new Date(current.getFullYear(), current.getMonth(), targetDate);
            calDatesWrap.append($(this.config.dateElement.apply(this, [prevDate.getDate(), prevDate])).addClass('calendar-date-prev'));
          }

          for (var _i = 1; _i <= totalDays; _i++) {
            current.setDate(_i);
            calDatesWrap.append(this.config.dateElement.apply(this, [_i, current]));
          }

          var endPadding = DAYS.indexOf(this.daysTransformed[6]) - current.getDay();

          if (endPadding < 0) {
            endPadding = 7 - Math.abs(endPadding);
          }

          for (var _i2 = 0; _i2 < endPadding; _i2++) {
            var _targetDate = current.getDate() + _i2 + 1;

            var nextDate = new Date(current.getFullYear(), current.getMonth(), _targetDate);
            calDatesWrap.append($(this.config.dateElement.apply(this, [nextDate.getDate(), nextDate])).addClass('calendar-date-next'));
          }
        } catch (e) {
          throw new Error(DATE_ELEMENT_ERROR);
        }
      } // Public methods

    }, {
      key: "destroy",
      value: function destroy() {
        this.currentTarget.removeClass('calendar-input calendar-wrapped').removeAttr('data-calendar-active');

        if (this.calTarget.unwrap) {
          this.calTarget.unwrap();
        }

        this.calRoot.remove();
        return this;
      }
    }, {
      key: "next",
      value: function next() {
        var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var numberOfCalendars = +this.config.numberOfCalendars;
        this.startMonthDate.setMonth(this.startMonthDate.getMonth() - numberOfCalendars + skip);

        this._drawMonths(this.startMonthDate);

        return this;
      }
    }, {
      key: "prev",
      value: function prev() {
        var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var numberOfCalendars = +this.config.numberOfCalendars;
        this.startMonthDate.setMonth(this.startMonthDate.getMonth() - numberOfCalendars - skip);

        this._drawMonths(this.startMonthDate);

        return this;
      }
    }, {
      key: "setDate",
      value: function setDate(date) {
        if (!this.config.rangeSelection) {
          this.currentDate = date instanceof Date ? date : _construct(Date, Array.prototype.slice.call(arguments));

          this._drawMonths(new Date(this.currentDate.valueOf()));
        } else {
          throw new Error(DATE_SELECTION_ERROR);
        }

        return this;
      }
    }, {
      key: "getDate",
      value: function getDate() {
        if (this.config.rangeSelection) {
          throw new Error(DATE_SELECTION_ERROR);
        }

        return new Date((this.currentDate || this.today).valueOf());
      }
    }, {
      key: "getToday",
      value: function getToday() {
        return new Date(this.today.valueOf());
      }
    }, {
      key: "setStartDate",
      value: function setStartDate(date) {
        if (this.config.rangeSelection) {
          this.startSelectionDate = date instanceof Date ? new Date(date.valueOf()) : _construct(Date, Array.prototype.slice.call(arguments));
          this.endSelectionDate = new Date(this.startSelectionDate.valueOf());
        } else {
          throw new Error(RANGE_SELECTION_ERROR);
        }

        return this;
      }
    }, {
      key: "setEndDate",
      value: function setEndDate(date) {
        if (this.config.rangeSelection) {
          this.endSelectionDate = date instanceof Date ? new Date(date.valueOf()) : _construct(Date, Array.prototype.slice.call(arguments));

          if (!this.startSelectionDate) {
            this.startSelectionDate = new Date(this.endSelectionDate.valueOf());
          }

          if (this.startSelectionDate && this.endSelectionDate.getTime() < this.startSelectionDate.getTime()) {
            console.warn(SWAP_WARNING);
            var endDate = new Date(this.startSelectionDate.valueOf());
            this.startSelectionDate = this.endSelectionDate;
            this.endSelectionDate = endDate;
          }
        } else {
          throw new Error(RANGE_SELECTION_ERROR);
        }

        return this;
      }
    }, {
      key: "getStartDate",
      value: function getStartDate() {
        if (!this.config.rangeSelection) {
          throw new Error(RANGE_SELECTION_ERROR);
        }

        return new Date((this.startSelectionDate || this.today).valueOf());
      }
    }, {
      key: "getEndDate",
      value: function getEndDate() {
        if (!this.config.rangeSelection) {
          throw new Error(RANGE_SELECTION_ERROR);
        }

        return new Date((this.endSelectionDate || this.today).valueOf());
      }
    }, {
      key: "jumpTo",
      value: function jumpTo(date) {
        this._drawMonths(date instanceof Date ? new Date(date.valueOf()) : _construct(Date, Array.prototype.slice.call(arguments)));

        return this;
      }
    }]);

    return ArgonCalendar;
  }();

  return ArgonCalendar;

})));
//# sourceMappingURL=argonCalendar.js.map
