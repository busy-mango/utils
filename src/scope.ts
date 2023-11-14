import { zip } from "./array";
import { and, or } from "./logic";
import { Split } from "./types";

export class Scope<K extends string> {
  /**
   * Converts the source string into an array by splitting it with the ':' delimiter.
   * @param source The source string to be converted.
   * @returns An array of strings.
   */
  public convert = (source: K) => source.split(':') as Split<K>;

  /**
   * Checks if the define and current values match.
   * @param define The define value to be compared.
   * @param current The current value to be compared.
   * @returns A boolean indicating whether the values match.
   */
  public isMatch = (define: K, current: K) => and(
    zip(this.convert(define), this.convert(current)),
    ([def, cur]) => def === '*' || def === cur,
  )

  /**
   * Checks if the current value is contained within the defines array.
   * @param defines An array of define values.
   * @param current The current value to be checked.
   * @returns A boolean indicating whether the current value is contained within the defines array.
   */
  public isContain = (defines: K[], current: K) => (
    or(defines, (cur) => this.isMatch(cur, current))
  )
}
