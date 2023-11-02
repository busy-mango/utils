import { isNonEmptyString } from '@busymango/is-esm';

/** 
 * Retrieves the value of a CSS variable. 
 * @param name The name of the CSS variable to retrieve. 
 * @param params Optional parameters for customization. 
 * @param params.initial The initial value to return if the CSS variable is not found or has no value. 
 * @param params.element The HTML element to compute the CSS variable value from. Defaults to document.body. 
 * @returns The value of the CSS variable if found, otherwise the initial value or undefined. 
 */
export function theCSSVariable<N extends string = string>(
  name?: N,
  params?: {
    initial?: string;
    element?: HTMLElement;
  }
): string | undefined {
  const {
    initial = undefined,
    element = document.body,
  } = params ?? {};

  if (!isNonEmptyString(name)) return initial;

  const computed = { style: getComputedStyle?.(element) };

  return computed.style?.getPropertyValue?.(name).trim() ?? initial;
}
