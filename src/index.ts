import { Calendar as CalendarCore, RenderedMonths } from 'argon-calendar-core';
import { generateMonths, renderTemplate, wrapElement } from './Utils';
import { CALENDAR_ROOT, ERR_TARGET, TEMPLATE_PROPS } from './Constants';
import { ArgonCalendarConfig, CalConfig, RenderHandler } from './Types';

export default class Calendar {
  #target: Element | null = null;
  #calendar: CalendarCore;
  #config: CalConfig;
  #userHandler: RenderHandler | null = null;
  #fragment: DocumentFragment | null = null;
  #offset = 0;
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
    this.#bindEvents();
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

  #renderTemplate(data: RenderedMonths) {
    this.#fragment = renderTemplate(TEMPLATE_PROPS, data, this.#config);
    if (typeof this.#userHandler === 'function') {
      this.#fragment = this.#userHandler(this.#fragment, {
        data,
        ids: TEMPLATE_PROPS,
        config: this.#config
      });
    }
  }

  #renderInternal() {
    const data = this.#calendar.create(this.#offset).output();
    const calendarMain = this.#target?.querySelector(`#${TEMPLATE_PROPS.main}`);
    if (calendarMain) {
      calendarMain.innerHTML = generateMonths(data, TEMPLATE_PROPS);
    } else {
      this.#renderTemplate(data);
      if (this.#target && this.#fragment) {
        this.#target.innerHTML = '';
        this.#target.appendChild(this.#fragment);
      }
    }
  }

  #bindEvents() {
    this.#target?.addEventListener('click', (event) => {
      const el = event.target as Element;
      if (el.closest(`#${TEMPLATE_PROPS.next}`)) {
        this.#offset += 1;
        this.#renderInternal();
      }
      if (el.closest(`#${TEMPLATE_PROPS.prev}`)) {
        this.#offset -= 1;
        this.#renderInternal();
      }
    });
  }

  render(handler?: RenderHandler) {
    if (typeof handler === 'function') {
      this.#userHandler = handler;
    }
    this.#renderInternal();
  }
}

export * from 'argon-html';
