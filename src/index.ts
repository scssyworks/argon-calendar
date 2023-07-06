import { Calendar as CalendarCore, RenderedMonths } from 'argon-calendar-core';
import {
  findIndexOf,
  generateMonths,
  renderTemplate,
  resolveWeekLabels,
  wrapElement
} from './Utils';
import {
  CALENDAR_ROOT,
  ERR_MAIN,
  ERR_TARGET,
  SELECTED_DATE_CLASS,
  TEMPLATE_PROPS
} from './Constants';
import { ArgonCalendarConfig, CalConfig, UserHandler } from './Types';

export default class Calendar {
  #target: Element | null = null;
  #calendar: CalendarCore;
  #config: CalConfig;
  #userHandler: UserHandler | null = null;
  #fragment: DocumentFragment | null = null;
  #renderedMonths: RenderedMonths = [];
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

  #renderTemplate() {
    if (!this.#fragment) {
      this.#fragment = renderTemplate(TEMPLATE_PROPS, this.#config);
      if (typeof this.#userHandler === 'function') {
        const updatedFragment = this.#userHandler(this.#fragment, {
          ids: TEMPLATE_PROPS,
          config: this.#config
        });
        if (updatedFragment instanceof DocumentFragment) {
          this.#fragment = updatedFragment;
        }
      }
      if (this.#target) {
        this.#target.innerHTML = '';
        this.#target.appendChild(this.#fragment);
      }
    }
  }

  #renderInternal() {
    this.#renderedMonths = resolveWeekLabels(
      this.#calendar.create(this.#offset).output(),
      this.#config
    );
    this.#renderTemplate();
    if (this.#target) {
      const calendarMain = this.#target.querySelector(
        `#${TEMPLATE_PROPS.main}`
      );
      if (calendarMain) {
        calendarMain.innerHTML = generateMonths(this.#renderedMonths);
      } else {
        throw new Error(ERR_MAIN);
      }
    }
  }

  #bindEvents() {
    this.#target?.addEventListener('click', (event) => {
      event.stopPropagation();
      const el = event.target as Element;
      const mainContainer = el.closest(`#${TEMPLATE_PROPS.main}`);
      if (el.closest(`#${TEMPLATE_PROPS.next}`)) {
        this.#offset += 1;
        this.#renderInternal();
      }
      if (el.closest(`#${TEMPLATE_PROPS.prev}`)) {
        this.#offset -= 1;
        this.#renderInternal();
      }
      if (mainContainer) {
        const composedPath = event.composedPath();
        const composedPathSubset = composedPath
          .reverse()
          .slice(composedPath.indexOf(mainContainer)) as Element[];
        const [, monthElement, datesElement, dateElement] = composedPathSubset;
        const currentSelectedDate = datesElement.querySelector(
          `.${SELECTED_DATE_CLASS}`
        );
        currentSelectedDate?.classList.remove(SELECTED_DATE_CLASS);
        currentSelectedDate?.setAttribute('tabindex', '-1');
        dateElement.removeAttribute('tabindex');
        dateElement.classList.add(SELECTED_DATE_CLASS);
        const monthIndex = findIndexOf(mainContainer, monthElement);
        const dateIndex = findIndexOf(datesElement, dateElement, 'BUTTON');
      }
    });
  }

  render(handler?: UserHandler) {
    if (typeof handler === 'function') {
      this.#userHandler = handler;
    }
    this.#renderInternal();
  }
}

export * from 'argon-html';
