import {
  RenderedMonths,
  Week,
  Calendar,
  RenderedMonthMeta
} from 'argon-calendar-core';
import { html, htmlString, classNames } from 'argon-html';
import { CalConfig, CustomDate, TemplateProps } from '../Types';
import { CONTAINER_CLASS, WRAPPER_CLASS, WeekLabelFormat } from '../Constants';

function createEl(className: string) {
  const el = document.createElement('div');
  el.setAttribute('class', className);
  return el;
}

export function dateFormatter(dt: Date, meta: RenderedMonthMeta): CustomDate {
  const isOutsideDate = dt.getMonth() !== meta.monthIndex;
  return {
    date: dt,
    formatted: `${dt.getDate()}`,
    isOutsideDate,
    isToday: !isOutsideDate && Calendar.isToday(dt)
  };
}

export function findIndexOf(parent: Element, child: Element, ofType?: string) {
  const currentChildren = Array.from(parent.children).filter((node) =>
    ofType ? node.nodeName === ofType : true
  );
  return currentChildren.indexOf(child);
}

export function wrapElement(elem: Element): HTMLDivElement {
  const wrapper = createEl(WRAPPER_CLASS);
  const container = createEl(CONTAINER_CLASS);
  wrapper.appendChild(container);
  elem.parentElement?.insertBefore(wrapper, elem);
  wrapper.prepend(elem);
  return container;
}

export function unwrapElement(elem: Element | null): boolean {
  if (elem) {
    const parent = elem.parentElement;
    if (parent?.classList.contains(WRAPPER_CLASS)) {
      parent.parentElement?.insertBefore(elem, parent);
      parent.remove();
      return true;
    }
  }
  return false;
}

export function generateMonths(
  data: RenderedMonths<CustomDate>,
  selectedDate?: CustomDate | null
) {
  return htmlString`${data.map((renderedMonth, mIndex) => {
    const { year, month, weekLabels, dates } = renderedMonth;
    return htmlString`
      <div class="argon-calendar-month">
        <div class="argon-calendar-summary">${month} ${year}</div>
        <div class="argon-calendar-dates">
        ${weekLabels.map(
          (label) =>
            htmlString`<div class="argon-calendar-week-label">${label}</div>`
        )}
        ${dates.map((customDate) => {
          const { formatted, isToday, isOutsideDate, date } = customDate;
          customDate.isRedundant =
            isOutsideDate && data.some((m) => m.monthIndex === date.getMonth());
          const isValidOutside = isOutsideDate && !customDate.isRedundant;
          customDate.isOutsidePrevious = isValidOutside && mIndex === 0;
          customDate.isOutsideNext =
            isValidOutside && mIndex === data.length - 1;
          customDate.isSelected =
            !isOutsideDate &&
            Calendar.compare(
              date,
              selectedDate?.date ? selectedDate.date : Calendar.today()
            );
          return htmlString`
            <button ${
              customDate.isSelected ? '' : 'tabindex="-1"'
            } class="${classNames('argon-calendar-date', {
            'argon-calendar-date-today': isToday,
            'argon-calendar-date-selected': customDate.isSelected,
            'argon-calendar-date-outside': isOutsideDate,
            'argon-calendar-date-redundant': customDate.isRedundant,
            'argon-calendar-date-outside-prev': customDate.isOutsidePrevious,
            'argon-calendar-date-outside-next': customDate.isOutsideNext
          })}">
              <span>${formatted}</span>
            </button>
          `;
        })}</div>
      </div>
    `;
  })}`;
}

export function renderTemplate(
  ids: TemplateProps,
  config: CalConfig
): DocumentFragment {
  const { hideFooter, hideHeader } = config;
  return html`
    <div class="argon-calendar-root" id="${ids.root}">
      ${
        !hideHeader
          ? htmlString`
            <div class="argon-calendar-header" id="${ids.header}">
              <button class="argon-calendar-prev" type="button" id="${ids.prev}">Prev</button>
              <button class="argon-calendar-next" type="button" id="${ids.next}">Next</button>
            </div>`
          : ''
      }
      <div class="argon-calendar-main" id="${ids.main}"></div>
      ${
        !hideFooter
          ? htmlString`
            <div class="argon-calendar-footer" id="${ids.footer}">
              <button type="button" class="argon-calendar-cancel" id="${ids.cancel}">Cancel</button>
              <button type="button" class="argon-calendar-submit" id="${ids.submit}">Submit</button>
            </div>`
          : ''
      }
    </div>
  `;
}

export function resolveWeekLabels(
  data: RenderedMonths<CustomDate>,
  config: CalConfig
): RenderedMonths<CustomDate> {
  const { weekLabelFormat = WeekLabelFormat.SHORTER } = config;
  return data.map((month) => ({
    ...month,
    weekLabels: month.weekLabels.map((label) => {
      switch (weekLabelFormat) {
        case WeekLabelFormat.LONG:
          return label;
        case WeekLabelFormat.SHORT:
          return label.substring(0, 3) as Week;
        default:
          return label.substring(0, 2) as Week;
      }
    })
  }));
}
