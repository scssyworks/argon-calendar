import { $ } from './Selector';
import { WRAPPING_ELEMENT_ERROR, CALENDARWRAP_HTML, CALENDARROOT_HTML, ROOT_ELEMENT_ERROR, CALENDARHEADER_HTML, CALENDARBODYROOT_HTML, CALENDARFOOTER_HTML, BODY_ROOT_ELEMENT_ERROR, DAYS, MONTHS, ACTIVE_CALENDAR_ERROR, DAYELEMENT_HTML, MONTHELEMENT_HTML, DATEELEMENT_HTML, YEARELEMENT_HTML, DAY_ELEMENT_ERROR, MONTH_ELEMENT_ERROR } from './Constants';
import { repl } from './Utils';

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
        this.daysTransformed = DAYS.slice(this.config.weekStartsFrom).concat(DAYS.slice(0, this.config.weekStartsFrom));
        this.monthsTransformed = MONTHS;
        this.drawCalendar();
    }
    drawCalendar() {
        const config = this.config;
        const currentTarget = $(config.target).first();
        if (currentTarget.data('calendarActive')) {
            throw new Error(ACTIVE_CALENDAR_ERROR);
        }
        let calendarTarget = currentTarget;
        currentTarget.data('calendarActive', true);
        if (currentTarget[0].nodeName === 'INPUT') {
            try {
                calendarTarget = currentTarget.wrap(config.calendarWrap()).addClass('calendar-wrap');
                currentTarget.addClass('calendar-input');
                if (calendarTarget.length === 0) {
                    throw new Error(WRAPPING_ELEMENT_ERROR);
                }
            } catch (e) {
                throw new Error(e.message);
            }
        }
        const calRoot = $(config.calendarRoot());
        if (calRoot.length) {
            calendarTarget.append(calRoot.addClass('calendar-root'));
            if (config.showHeader) {
                calRoot.append($(config.calendarHeader()).addClass('calendar-header'));
            }
            this.calBody = $(config.calendarBodyRoot()).addClass('calendar-body-root');
            if (this.calBody.length === 0) {
                throw new Error(BODY_ROOT_ELEMENT_ERROR);
            }
            calRoot.append(this.calBody);
            if (config.showFooter) {
                calRoot.append($(config.calendarFooter()).addClass('calendar-footer'));
            }
            this.drawDays();
        } else {
            throw new Error(ROOT_ELEMENT_ERROR);
        }
    }
    drawDays() {
        const current = new Date();
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
            current.setMonth(current.getMonth() + 1);
        }
    }
    drawDates() {
        // TODO
    }
}

window.ArgonCalendar = ArgonCalendar;