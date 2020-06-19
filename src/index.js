import { $ } from './Selector';
import {
    WRAPPING_ELEMENT_ERROR,
    ROOT_ELEMENT_ERROR,
    BODY_ROOT_ELEMENT_ERROR,
    DAYS,
    MONTHS,
    ACTIVE_CALENDAR_ERROR,
    DAY_ELEMENT_ERROR,
    MONTH_ELEMENT_ERROR,
    DATE_ELEMENT_ERROR,
    DAY_INDEX_ERROR,
    RANGE_SELECTION_ERROR,
    DATE_SELECTION_ERROR,
    SWAP_WARNING
} from './Constants';
import {
    calendarWrap,
    calendarRoot,
    calendarHeader,
    calendarBodyRoot,
    calendarFooter,
    dayElement,
    monthElement,
    dateElement,
    exact
} from './Builder';
import { daysInMonth } from './Utils';
import { assign } from './Assign';

export default class ArgonCalendar {
    constructor(config = {}) {
        this.config = Object.freeze(assign({
            target: document.body,
            weekStartsFrom: 0,
            numberOfCalendars: 1,
            rangeSelection: false,
            defaultEvents: true,
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
        if (this.config.defaultEvents) {
            this.boundingElement = $(this.config.target);
            this.boundingElement.on('mousedown', '.calendar-date', (e) => {
                const timestamp = $(e.target).data('timestamp');
                const { onSelectionStart, onSelectionEnd } = this.config;
                if (this.config.rangeSelection) {
                    if (!this.selectionStarted) {
                        this.selectionStarted = true;
                        const startDate = new Date(timestamp);
                        this.setStartDate(startDate)
                            .jumpTo(startDate);
                        if (typeof onSelectionStart === 'function') {
                            onSelectionStart.apply(this);
                        }
                    } else {
                        const endDate = new Date(timestamp);
                        this.setEndDate(endDate)
                            .jumpTo(endDate);
                        delete this.selectionStarted;
                    }
                } else {
                    const date = new Date(timestamp);
                    this.setDate(date);
                }
                if (typeof onSelectionEnd === 'function') {
                    onSelectionEnd.apply(this);
                }
            });
        }
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
            const calMonth = $('<div class="calendar-month-wrap"></div>');
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
        if (this.config.defaultEvents) {
            this.boundingElement.off();
        }
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
    isMatch() {
        return exact.apply(this, arguments);
    }
}