import { CalendarConfig, RenderedMonths } from 'argon-calendar-core';
import { WeekLabelFormat } from '../Constants';

export type TemplateProps = {
  root: string;
  header: string;
  footer: string;
  next: string;
  prev: string;
  main: string;
  submit: string;
  cancel: string;
};

export interface ArgonCalendarConfig extends CalendarConfig {
  wrapTarget?: boolean;
  rangeSelection?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  weekLabelFormat?: WeekLabelFormat;
}

export type CalConfig = Omit<
  ArgonCalendarConfig,
  'visibleMonthCount' | 'visibleWeekCount' | 'weekStartsOn'
>;

export type RenderProps = {
  config: CalConfig;
  ids: TemplateProps;
};

export type UserHandler = (
  currentFragment: DocumentFragment,
  props: RenderProps
) => DocumentFragment;

export type CustomDate = {
  date: Date;
  formatted: string;
  isOutsideDate: boolean;
  isToday: boolean;
  // Post render fields
  isOutsidePrevious?: boolean;
  isOutsideNext?: boolean;
  isRedundant?: boolean;
  isSelected?: boolean;
};
