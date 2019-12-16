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

function isToday(currentDate, referenceDate) {
    return (
        currentDate.getDate() === referenceDate.getDate()
        && currentDate.getMonth() === referenceDate.getMonth()
        && currentDate.getYear() === referenceDate.getYear()
    );
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
    if (isToday(this.today, current)) {
        return $(repl(DATEELEMENT_HTML, { date })).addClass('is-today').outerHtml();
    }
    return repl(DATEELEMENT_HTML, { date });
}