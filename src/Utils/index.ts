import { RenderedMonths, Week, Calendar } from 'argon-calendar-core';
import { html, htmlString, classNames } from 'argon-html';
import { CalConfig, TemplateProps } from '../Types';
import { WeekLabelFormat } from '../Constants';

function createEl(className: string) {
  const el = document.createElement('div');
  el.setAttribute('class', className);
  return el;
}

export function findIndexOf(parent: Element, child: Element, ofType?: string) {
  const currentChildren = Array.from(parent.children).filter((node) =>
    ofType ? node.nodeName === ofType : true
  );
  return currentChildren.indexOf(child);
}

export function wrapElement(elem: Element): HTMLDivElement {
  const wrapper = createEl('argon-calendar-wrapper');
  const container = createEl('argon-calendar');
  wrapper.appendChild(container);
  elem.parentElement?.insertBefore(wrapper, elem);
  wrapper.prepend(elem);
  return container;
}

export function generateMonths(
  data: RenderedMonths,
  selectedDate?: Date | null
) {
  return htmlString`${data.map((renderedMonth, mIndex) => {
    const { year, month, monthIndex, weekLabels, dates } = renderedMonth;
    return htmlString`
      <div class="argon-calendar-month">
        <div class="argon-calendar-summary">${month} ${year}</div>
        <div class="argon-calendar-dates">
        ${weekLabels.map(
          (label) =>
            htmlString`<div class="argon-calendar-week-label">${label}</div>`
        )}
        ${dates.map((date) => {
          const isOutside = date.getMonth() !== monthIndex;
          const isRedundant =
            isOutside && data.some((m) => m.monthIndex === date.getMonth());
          const isValidOutside = isOutside && !isRedundant;
          const isOutsidePrevious = isValidOutside && mIndex === 0;
          const isOutsideNext = isValidOutside && mIndex === data.length - 1;
          const isToday = !isOutside && Calendar.isToday(date);
          const isSelected =
            !isOutside &&
            Calendar.compare(
              date,
              selectedDate ? selectedDate : Calendar.today()
            );
          return htmlString`
            <button ${
              isSelected ? '' : 'tabindex="-1"'
            } ${
            isRedundant ? `data-is-redundant="${isRedundant}"` : ''
          } data-offset="${
            isOutsidePrevious ? -1 : isOutsideNext ? 1 : 0
          }" class="${classNames('argon-calendar-date', {
            'argon-calendar-date-today': isToday,
            'argon-calendar-date-selected': isSelected,
            'argon-calendar-date-outside': isOutside,
            'argon-calendar-date-redundant': isRedundant,
            'argon-calendar-date-outside-prev': isOutsidePrevious,
            'argon-calendar-date-outside-next': isOutsideNext
          })}">
              <span>${date.getDate()}</span>
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
  data: RenderedMonths,
  config: CalConfig
): RenderedMonths {
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
