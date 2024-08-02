import type { PartialRecord } from './types';

/**
 * Create a dom and set attribute
 * @param {string} name - dom tag name
 * @param {Record<string, string>} attrs - dom attribute
 * @param {HTMLElement} container - dom container, element is automatically append only when `container` is not nill
 * @returns {HTMLElement} - the dom instance
 */
function create(
  name: string,
  attrs: PartialRecord<string, string>,
  container?: HTMLElement
) {
  const tag = document.createElement(name);

  Object.entries(attrs).forEach((args) => {
    tag.setAttribute(...(args as [string, string]));
  });

  container && container.append(tag);

  return tag;
}

/** dom operate */
export const dom = { create };
