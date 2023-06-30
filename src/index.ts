import {
  Calendar as CalendarCore,
  CalendarConfig,
  RenderedMonths
} from 'argon-calendar-core';
import { renderTemplate, wrapElement } from './Utils';
import { TEMPLATE_PROPS, TemplateProps } from './Constants';

export interface ArgonCalendarConfig extends CalendarConfig {
  target: string;
  wrapTarget?: boolean;
  rangeSelection?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default class Calendar {
  #target: Element | null = null;
  #calendar: CalendarCore;
  #config: Omit<
    ArgonCalendarConfig,
    'visibleMonthCount' | 'visibleWeekCount' | 'weekStartsOn'
  >;
  constructor(config: Partial<ArgonCalendarConfig> = {}) {
    const { visibleMonthCount, visibleWeekCount, weekStartsOn, ...restConfig } =
      config;
    this.#calendar = new CalendarCore({
      visibleMonthCount,
      visibleWeekCount,
      weekStartsOn
    });
    this.#config = Object.freeze(
      Object.assign(
        {
          target: '#calendarRoot'
        },
        restConfig
      )
    );
    this.#resolveTarget(this.#config.target);
  }
  #resolveTarget(target: string | Element) {
    const { wrapTarget } = this.#config;
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        this.#target = el;
        if (wrapTarget) {
          this.#target = wrapElement(this.#target);
        }
      }
    } else if (target instanceof Element) {
      this.#target = target;
    }
  }
  #renderInternal(data: RenderedMonths, customTemplate?: string) {
    if (this.#target) {
      const fragment = renderTemplate(data, customTemplate);
      this.#target.innerHTML = '';
      this.#target.appendChild(fragment);
    } else {
      throw new Error('Target could not be resolved!');
    }
  }

  render(template?: (props: TemplateProps) => string) {
    this.#renderInternal(
      this.#calendar.create().output(),
      template?.(TEMPLATE_PROPS)
    );
    return this;
  }
}
