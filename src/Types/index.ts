import { CalendarConfig, RenderedMonths } from 'argon-calendar-core';

export type TemplateProps = {
  root: string;
  header: string;
  footer: string;
  next: string;
  prev: string;
  main: string;
  month: string;
  date: string;
  submit: string;
  cancel: string;
};

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

export type RenderProps = {
  data: RenderedMonths;
  config: CalConfig;
  ids: TemplateProps;
};

export type RenderHandler = (
  currentFragment: DocumentFragment,
  props: RenderProps
) => DocumentFragment;
