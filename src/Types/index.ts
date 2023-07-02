import { CalendarConfig } from 'argon-calendar-core';

export interface ArgonCalendarConfig extends CalendarConfig {
  wrapTarget?: boolean;
  rangeSelection?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export type CalConfig = Omit<
  ArgonCalendarConfig,
  'visibleMonthCount' | 'visibleWeekCount' | 'weekStartsOn'
>;
