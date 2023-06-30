import { RenderedMonths } from 'argon-calendar-core';

export function wrapElement(elem: Element): HTMLDivElement {
  // @todo Revisit this implementation as we can take advantage of native "prepend" method
  const wrapper = document.createElement('div');
  const container = document.createElement('div');
  wrapper.setAttribute('class', 'argon-calendar-wrapper');
  container.setAttribute('class', 'argon-calendar');
  const parentElem = elem.parentElement;
  const fragment = document.createDocumentFragment();
  // Detach to a fragment
  parentElem?.childNodes.forEach((node) => {
    if (node === elem) {
      wrapper.appendChild(node);
      fragment.appendChild(wrapper);
    }
    fragment.appendChild(node);
  });
  wrapper.appendChild(container);
  // Re-attach fragment back to parent elem
  parentElem?.appendChild(fragment);
  return container;
}

export function renderTemplate(
  data: RenderedMonths,
  template?: string
): DocumentFragment {
  const toRender: string = template ?? '';
  const tmpl = document.createElement('template');
  tmpl.innerHTML = toRender;
  return tmpl.content;
}
