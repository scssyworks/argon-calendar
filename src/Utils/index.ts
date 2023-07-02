import { MONTHS, RenderedMonths, calendar } from 'argon-calendar-core';
import { html, htmlString } from 'argon-html';
import { TemplateProps } from '../Constants';
import { CalConfig } from '../Types';

function createEl(className: string) {
  const el = document.createElement('div');
  el.setAttribute('class', className);
  return el;
}

export function wrapElement(elem: Element): HTMLDivElement {
  const wrapper = createEl('argon-calendar-wrapper');
  const container = createEl('argon-calendar');
  wrapper.appendChild(container);
  const parentElem = elem.parentElement;
  parentElem?.insertBefore(wrapper, elem);
  wrapper.prepend(elem);
  return container;
}

export function defaultHandler(
  ids: TemplateProps,
  data: RenderedMonths,
  config: CalConfig
): DocumentFragment {
  const { hideFooter, hideHeader } = config;
  const availableMonths = data.map((m) => m.month);
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
      <div class="argon-calendar-main" id="${ids.main}">
        ${data.map((renderedMonth, index) => {
          const { year, month, weekLabels, dates } = renderedMonth;
          return htmlString`
            <div class="argon-calendar-month" id="${`${ids.month}-${index}`}">
              <div class="argon-calendar-summary">${month} ${year}</div>
              <div class="argon-calendar-dates">
              ${weekLabels.map(
                (week) =>
                  htmlString`<div class="argon-calendar-week-label">${week.substring(
                    0,
                    2
                  )}</div>`
              )}
              ${dates.map((date, index) => {
                const timestamp = date.getTime();
                const isSelected = calendar.isToday(date);
                const isOutside = !availableMonths.includes(
                  MONTHS[date.getMonth()]
                );
                return htmlString`
                  <button ${
                    isSelected ? '' : 'tabindex="-1"'
                  } class="argon-calendar-date${
                  isSelected ? ' argon-calendar-date-selected' : ''
                }${
                  isOutside ? ' argon-calendar-date-outside' : ''
                }" id="${`${ids.date}-${index}`}" data-timestamp="${timestamp}">
                    <span>${date.getDate()}</span>
                  </button>
                `;
              })}</div>
            </div>
          `;
        })}
      </div>
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
