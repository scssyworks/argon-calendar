import { TemplateProps } from '../Types';

export const CALENDAR_ROOT = 'calendarRoot';

export const TEMPLATE_PROPS: TemplateProps = {
  root: 'argonCalendarRoot',
  header: 'argonCalendarHeader',
  footer: 'argonCalendarFooter',
  next: 'argonCalendarNext',
  prev: 'argonCalendarPrev',
  main: 'argonCalendarMain',
  submit: 'argonCalendarSubmit',
  cancel: 'argonCalendarCancel'
};

export const ERR_TARGET = 'Target element could not be resolved!';

export enum WeekLabelFormat {
  LONG = 'long', // full length
  SHORT = 'short', // length === 3
  SHORTER = 'shorter' // length === 2 (default)
}
