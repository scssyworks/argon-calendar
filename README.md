# Argon Calendar
A customizable calendar component hackable to its core.

# Install

```sh
npm i argon-calendar
```

# About

Argon calendar is not a regular calendar plugin. It's a library (minimalistic and customizable) with a basic set of APIs to interface with a calendar. It uses native browser APIs under the hood. <br>
If you are looking to build your own calendar plugin, this is the place where you start. <br>

# How does it work?

## Initialize

```js
import ArgonCalendar from 'argon-calendar';

const calendar = new ArgonCalendar({
    target: '#calendarTarget', // Target where calendar should be rendered. [mandatory]
    weekStartsFrom: 0, // Default: 0. 0 is Sunday, 1 is Monday, and so on... [optional]
    numberOfCalendars: 2, // Default: 1. Number of months to be shown. [optional]
    rangeSelection: false, // Default: false. If "true" then range selection is enabled. [optional]
    showHeader: true, // Enable calendar header. [optional]
    showFooter: true, // Enable calendar footer. [optional]
    calendarWrap() { ... }, // Return HTML for input wrapper element. Works only for "input" target. [optional]
    calendarRoot() { ... }, // Return HTML for calendar top level element. [optional]
    calendarHeader() { ... }, // Return HTML for calendar header. [optional]
    calendarFooter() { ... }, // Return HTML for calendar footer. [optional]
    calendarBodyRoot() { ... }, // Return root element HTML for calendar body. Calendar body contains the HTML for calendar months. [optional]
    dayElement(day) { ... }, // Customize day element HTML (Monday, Tuesday, Wednesday, etc.). [optional]
    dateElement(dateString, dateObject) { ... }, // Customize date element HTML. [optional]
    monthElement(monthString, dateObject) { ... } // Customize month element HTML. [optional]
});
```

## Navigate forward or backward

You can load previous or next months using ``prev`` and ``next``.

```js
calendar.prev(1 /* Optional skip parameter */); // Loads previous month(s). Optional "skip" parameter specifies how many months should be skipped.
calendar.next(1 /* Optional skip parameter */); // Loads next month(s). Optional "skip" parameter specifies how many months should be skipped.
```

## Set a date

A single date can be set if ``rangeSelection`` is turned off.

```js
calendar.setDate(/* Date object OR valid Date constructor arguments */);
```

## Set a date range

A date range can be set if ``rangeSelection`` is turned on.

```js
calendar
    .setStartDate(/* Date object OR valid Date constructor arguments */)
    .setEndDate(/* Date object OR valid Date constructor arguments */) // These two methods will not re-render months
    .jumpTo(/* Date object representing first month in the view */); // You should call this method to re-render months and diplay date range
```

## Get current date set using "setDate" method

```js
const currentDate = calendar.getDate(); // Works only if "rangeSelection" is turned off.
```

## Get date range set using "setStartDate" and "setEndDate" methods

```js
const startDate = calendar.getStartDate(); // Works only if "rangeSelection" is turned on.
const endDate = calendar.getEndDate(); //  Works only if "rangeSelection" is turned on.
```

## Get today's date

```js
const today = calendar.getToday();
```

## Destroy the calendar

```js
calendar.destroy();
```

# Just an FYI !!!

Argon calendar does not: <br>
1. Automatically populate input fields.<br>
2. Implement events to select date or date range.<br>
3. Provide a month or year view yet (very common is calendar plugins these days). <br>

# Your contribution

Argon calendar is a simple library, easy to understand and use. However, if you still face any issues, please feel free to log defects, provide suggestions or raise PRs. I would highly appreciate your contribution towards this project.