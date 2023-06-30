# Argon Calendar

A customizable calendar component for Core JS projects

# Install

```sh
npm i argon-calendar
```

# About

Argon calendar is a `core-js` library that uses
[argon-calendar-core](https://github.com/scssyworks/argon-calendar-core) API to
render calendar for regular JavaScript projects. It is designed to be intuitive
and fully customizable.

# How does it work?

## Initialize

```js
import ArgonCalendar from 'argon-calendar';

const calendar = new ArgonCalendar({
    target: '#calendarTarget', // Target where calendar should be rendered. [mandatory]
    weekStartsFrom: 0, // Default: 0. 0 is Sunday, 1 is Monday, and so on... [optional]
    wrapTarget: false, // True for input types. Wrap existing target and place calendar inside the wrapping element. [optional]
    numberOfCalendars: 2, // Default: 1. Number of months to be shown. [optional]
    rangeSelection: false, // Default: false. If "true" then range selection is enabled. [optional]
    showHeader: true, // Enable calendar header. [optional]
    showFooter: true, // Enable calendar footer. [optional]
    calendarWrap() { ... }, // To wrap current input element. Works only for "input" as a target. [optional]
    calendarRoot() { ... }, // Customize calendar top level element. [optional]
    calendarHeader() { ... }, // Customize calendar header. [optional]
    calendarFooter() { ... }, // Customize calendar footer. [optional]
    calendarBodyRoot() { ... }, // Customize calendar body element. [optional]
    dayElement(day) { ... }, // Customize day element (Monday, Tuesday, Wednesday, etc.). [optional]
    dateElement(dateString, dateObject) { ... }, // Customize date element. [optional]
    monthElement(monthString, dateObject) { ... } // Customize month element. [optional]
});
```

## Navigate forward or backward

```js
calendar.prev(1 /* Optional skip parameter */); // Loads previous month(s). Optional "skip" parameter specifies how many months should be skipped.
calendar.next(1 /* Optional skip parameter */); // Loads next month(s). Optional "skip" parameter specifies how many months should be skipped.
```

## Set a date

A single date can be set if `rangeSelection` is turned off.

```js
calendar.setDate(/* Date object OR valid Date constructor arguments */);
```

## Set a date range

A date range can be set if `rangeSelection` is turned on.

```js
calendar
  .setStartDate()
  /* Date object OR valid Date constructor arguments */
  .setEndDate() // These two methods will not re-render months
  /* Date object OR valid Date constructor arguments */ .jumpTo(
    /* Date object representing first month in the view */
  ); // You should call this method to re-render months and diplay date range
```

## Get current date

```js
const currentDate = calendar.getDate(); // Works if "rangeSelection" is turned off.
```

## Get date range

```js
const startDate = calendar.getStartDate(); // Works if "rangeSelection" is turned on.
const endDate = calendar.getEndDate(); //  Works if "rangeSelection" is turned on.
```

## Get today's date

```js
const today = calendar.getToday();
```

## Destroy calendar

```js
calendar.destroy();
```

# Important!

Argon calendar does not support (and probably will never support) following
features: <br>

1. Range selection by clicking date elements <br>
2. Automatically populate input fields <br>
3. Display calendar as a popup <br>

Please note that argon calendar does not assume how your calendar component
should behave or look like. It provides a set of APIs which are crucial for a a
calendar plugin to work. The plugin part is what you need to build yourself.

# Your contribution

Argon calendar is a simple library, easy to understand and use. However, if you
still face any issues, please feel free to log defects, provide suggestions or
raise PRs. I would highly appreciate your contribution towards this project.
