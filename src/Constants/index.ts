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

export const CALENDAR_ROOT = 'calendarRoot';

export const TEMPLATE_PROPS: TemplateProps = {
  root: 'argonCalendarRoot',
  header: 'argonCalendarHeader',
  footer: 'argonCalendarFooter',
  next: 'argonCalendarNext',
  prev: 'argonCalendarPrev',
  main: 'argonCalendarMain',
  month: 'argonCalendarMonth',
  date: 'argonCalendarDate',
  submit: 'argonCalendarSubmit',
  cancel: 'argonCalendarCancel'
};

export const ERR_TARGET = 'Target element could not be resolved!';
export const ERR_HANDLER = 'Template handler is not a function!';
