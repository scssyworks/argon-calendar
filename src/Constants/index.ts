export type TemplateProps = {
  header: string;
  footer: string;
  next: string;
  prev: string;
  container: string;
  submit: string;
  cancel: string;
};

export const TEMPLATE_PROPS: TemplateProps = {
  header: 'argonCalendarHeader',
  footer: 'argonCalendarFooter',
  next: 'argonCalendarNext',
  prev: 'argonCalendarPrev',
  container: 'argonCalendarContainer',
  submit: 'argonCalendarSubmit',
  cancel: 'argonCalendarCancel'
};
