import { Calendar as CalendarCore } from 'argon-calendar-core';
import { defaultHandler, wrapElement } from './Utils';
import {
  CALENDAR_ROOT,
  ERR_HANDLER,
  ERR_TARGET,
  TEMPLATE_PROPS
} from './Constants';
import { ArgonCalendarConfig, CalConfig } from './Types';

export default class Calendar {
  #target: Element | null = null;
  #calendar: CalendarCore;
  #config: CalConfig;
  constructor(
    target = `#${CALENDAR_ROOT}`,
    config: Partial<ArgonCalendarConfig> = {}
  ) {
    const { visibleMonthCount, visibleWeekCount, weekStartsOn, ...restConfig } =
      config;
    this.#calendar = new CalendarCore({
      visibleMonthCount,
      visibleWeekCount,
      weekStartsOn
    });
    this.#config = Object.freeze(restConfig);
    this.#resolveTarget(target);
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
    } else {
      throw new Error(ERR_TARGET);
    }
  }
  #renderInternal(fragment: DocumentFragment) {
    if (this.#target) {
      this.#target.innerHTML = '';
      this.#target.appendChild(fragment);
    }
  }

  render(handler = defaultHandler) {
    if (typeof handler === 'function') {
      const data = this.#calendar.create().output();
      this.#renderInternal(handler(TEMPLATE_PROPS, data, this.#config));
    } else {
      throw new Error(ERR_HANDLER);
    }
  }
}

export * from 'argon-html';
