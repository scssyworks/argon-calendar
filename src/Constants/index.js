// Selector
export const WRAP_ERROR = 'Cannot wrap "undefined" element';
// Calendar
export const ACTIVE_CALENDAR_ERROR = 'There is an existing calendar on current element';
export const WRAPPING_ELEMENT_ERROR = 'Function "calendarWrap" must return a valid HTML';
export const ROOT_ELEMENT_ERROR = 'Function "calendarRoot" must return a valid root element HTML';
export const BODY_ROOT_ELEMENT_ERROR = 'Function "calendarBodyRoot" must return a valid body root element HTML to render calendar correctly';
export const DAY_ELEMENT_ERROR = 'Function "dayElement" must return a valid day element HTML';
export const MONTH_ELEMENT_ERROR = 'Function "monthElement" must return a valid month element HTML';
export const DATE_ELEMENT_ERROR = 'Function "dateElement" must return a valid date element HTML';
export const DAY_INDEX_ERROR = 'Please select a day between [0,6] where 0 = "Sunday" and 6 = "Saturday"';
export const RANGE_SELECTION_ERROR = 'To use this feature set "rangeSelection" to true';
export const DATE_SELECTION_ERROR = 'To use this feature set "rangeSelection" to false';
export const SWAP_WARNING = 'Swapping start date with end date as current end date is smaller than start date.';
// Calendar HTML defaults
export const CALENDARWRAP_HTML = `<div class="calendar-wrap"></div>`;
export const CALENDARROOT_HTML = `<div class="calendar-root"></div>`;
export const CALENDARHEADER_HTML = `<div class="calendar-header">
    This is a placeholder header. Use "calendarHeader()" method to customise calendar header
</div>`;
export const CALENDARBODYROOT_HTML = `<div class="calendar-body-root"></div>`;
export const CALENDARFOOTER_HTML = `<div class="calendar-footer">
    This is a placeholder footer. Use "calendarFooter()" method to customise calendar footer
</div>`;
export const DAYELEMENT_HTML = `<div class="calendar-day">{{day}}</div>`;
export const DATEELEMENT_HTML = `<button type="button" class="calendar-date">{{date}}</button>`;
export const MONTHELEMENT_HTML = `<div class="calendar-month">{{month}}</div>`;
export const YEARELEMENT_HTML = `<div class="calendar-year">{{year}}</div>`;
export const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];
export const MONTHS = [
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