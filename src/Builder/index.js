import {
    CALENDARWRAP_HTML,
    CALENDARROOT_HTML,
    CALENDARHEADER_HTML,
    CALENDARBODYROOT_HTML,
    CALENDARFOOTER_HTML,
    DAYELEMENT_HTML,
    MONTHELEMENT_HTML,
    DATEELEMENT_HTML
} from '../Constants';
import { repl } from '../Utils';
import { $ } from '../Selector';

export function exact(currentDate, referenceDate) {
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

export function calendarWrap() {
    return CALENDARWRAP_HTML;
}

export function calendarRoot() {
    return CALENDARROOT_HTML;
}

export function calendarHeader() {
    return CALENDARHEADER_HTML;
}

export function calendarBodyRoot() {
    return CALENDARBODYROOT_HTML;
}

export function calendarFooter() {
    return CALENDARFOOTER_HTML;
}

export function dayElement(day) {
    return repl(DAYELEMENT_HTML, { day });
}

export function monthElement(month) {
    return repl(MONTHELEMENT_HTML, { month });
}

export function dateElement(date, current) {
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