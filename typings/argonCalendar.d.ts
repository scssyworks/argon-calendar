declare interface ArgonCalendarConstructorOptions {
    target: string | Node | NodeList | HTMLCollection;
    calendarWrap(): string;
    calendarRoot(): string;
    calendarHeader(): string;
    calendarFooter(): string;
    calendarBodyRoot(): string;
    dayElement(day: string): string;
    dateElement(dateString: string, dateObject: Date): string;
    monthElement(monthString: string, dateObject: Date): string;
    weekStartsFrom?: number;
    numberOfCalendars?: number;
    rangeSelection?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
}

declare class ArgonCalendar {
    constructor(config: ArgonCalendarConstructorOptions);
    destroy(): ArgonCalendar;
    prev(skip: number): ArgonCalendar;
    next(skip: number): ArgonCalendar;
    jumpTo(date: Date | string | number): ArgonCalendar;
    setDate(date: Date | string | number): ArgonCalendar;
    setStartDate(date: Date | string | number): ArgonCalendar;
    setEndDate(date: Date | string | number): ArgonCalendar;
    getDate(): Date;
    getToday(): Date;
    getStartDate(): Date;
    getEndDate(): Date;
    isMatch(date: Date, compareDate: Date): boolean;
}

export default ArgonCalendar;