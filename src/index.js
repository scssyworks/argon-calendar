import { $ } from './Selector';
import { WRAPPING_ELEMENT_ERROR, CALENDARWRAP_HTML, CALENDARROOT_HTML, ROOT_ELEMENT_ERROR, CALENDARHEADER_HTML, CALENDARBODYROOT_HTML, CALENDARFOOTER_HTML, BODY_ROOT_ELEMENT_ERROR, DAYS, MONTHS, ACTIVE_CALENDAR_ERROR, DAYELEMENT_HTML, MONTHELEMENT_HTML, DATEELEMENT_HTML, YEARELEMENT_HTML, DAY_ELEMENT_ERROR, MONTH_ELEMENT_ERROR, DATE_ELEMENT_ERROR, DAY_INDEX_ERROR } from './Constants';
import { repl, daysInMonth } from './Utils';

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
    drawMonths() {
        const current = new Date();
        current.setDate(1);
        let index = 0;
        while (index < this.config.numberOfCalendars) {
            const monthWrap = $('<div class="calendar-month"></div>');
            try {
                monthWrap.append(this.config.monthElement(this.monthsTransformed[current.getMonth()]));
            } catch (e) {
                throw new Error(MONTH_ELEMENT_ERROR);
            }
            try {
                monthWrap.append(`<div class="calendar-days-wrap">${this.daysTransformed.map(this.config.dayElement).join('')}</div>`);
            } catch (e) {
                throw new Error(DAY_ELEMENT_ERROR);
            }
            const calDatesWrap = $('<div class="calendar-dates"></div>');
            monthWrap.append(calDatesWrap);
            this.calBody.append(monthWrap);
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
}

window.ArgonCalendar = ArgonCalendar;