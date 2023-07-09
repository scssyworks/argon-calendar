import { Calendar as CalendarCore, RenderedMonths } from 'argon-calendar-core';
import {
  dateFormatter,
  findIndexOf,
  generateMonths,
  renderTemplate,
  resolveWeekLabels,
  unwrapElement,
  wrapElement
} from './Utils';
import {
  CALENDAR_ROOT,
  ERR_MAIN,
  ERR_TARGET,
  SELECTED_DATE_CLASS,
  TEMPLATE_PROPS
} from './Constants';
import {
  ArgonCalendarConfig,
  CalConfig,
  CustomDate,
  UserHandler
} from './Types';
import { version as vers } from '../package.json';

export default class Calendar {
  #targetRef: string;
  #target: Element | null = null;
  #calendar: CalendarCore;
  #config: CalConfig;
  #userHandler: UserHandler | null = null;
  #fragment: DocumentFragment | null = null;
  #renderedMonths: RenderedMonths<CustomDate> = [];
  #selectedDate: CustomDate | null = null;
  #offset = 0;
  #unbind: () => void;
  constructor(
    target = `#${CALENDAR_ROOT}`,
    config: Partial<ArgonCalendarConfig> = {}
  ) {
    const { visibleMonthCount, visibleWeekCount, weekStartsOn, ...restConfig } =
      config;
    this.#targetRef = target;
    this.#calendar = new CalendarCore({
      visibleMonthCount,
      visibleWeekCount,
      weekStartsOn
    });
    this.#config = Object.freeze(restConfig);
    this.#resolveTarget();
    this.#unbind = this.#bindEvents();
  }
  #resolveTarget() {
    const { wrapTarget } = this.#config;
    if (typeof this.#targetRef === 'string') {
      const el = document.querySelector(this.#targetRef);
      if (el) {
        this.#target = el;
        if (wrapTarget) {
          this.#target = wrapElement(this.#target);
        }
      }
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
      this.#calendar.create(this.#offset).map<CustomDate>(dateFormatter),
      this.#config
    );
    this.#renderTemplate();
    if (this.#target) {
      const calendarMain = this.#target.querySelector(
        `#${TEMPLATE_PROPS.main}`
      );
      if (calendarMain) {
        calendarMain.innerHTML = generateMonths(
          this.#renderedMonths,
          this.#selectedDate
        );
      } else {
        throw new Error(ERR_MAIN);
      }
    }
  }

  #bindEvents() {
    const evtFunction = (event: Event) => {
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
          .slice(composedPath.indexOf(mainContainer) + 1) as HTMLElement[];
        const [monthElement, datesElement, dateElement] = composedPathSubset;
        const monthIndex = findIndexOf(mainContainer, monthElement);
        const dateIndex = findIndexOf(datesElement, dateElement, 'BUTTON');
        this.#selectedDate = this.#renderedMonths[monthIndex].dates[dateIndex];
        const { isRedundant, isOutsidePrevious, isOutsideNext } =
          this.#selectedDate;
        const offset = isOutsidePrevious ? -1 : isOutsideNext ? 1 : 0;
        if (!isRedundant) {
          if (offset === 0) {
            const currentSelectedDate = mainContainer.querySelector(
              `.${SELECTED_DATE_CLASS}`
            );
            currentSelectedDate?.classList.remove(SELECTED_DATE_CLASS);
            currentSelectedDate?.setAttribute('tabindex', '-1');
            dateElement.removeAttribute('tabindex');
            dateElement.classList.add(SELECTED_DATE_CLASS);
          } else {
            this.#offset += offset;
            this.#renderInternal();
          }
        }
      }
    };
    this.#target?.addEventListener('click', evtFunction);
    return () => {
      this.#target?.removeEventListener('click', evtFunction);
    };
  }

  render(handler?: UserHandler) {
    if (typeof handler === 'function') {
      this.#userHandler = handler;
    }
    this.#renderInternal();
  }

  destroy() {
    this.#unbind();
    const { wrapTarget } = this.#config;
    if (wrapTarget) {
      unwrapElement(document.querySelector(this.#targetRef));
    } else if (this.#target) {
      this.#target.innerHTML = '';
    }
  }

  get version() {
    return vers;
  }
}

export * from 'argon-html';
