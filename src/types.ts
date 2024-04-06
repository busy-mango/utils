export type IKey = string | number | symbol;

/** Define `Y` or `N` */
export type YesOrNo = 'Y' | 'N';

/** Define predicate */
export type Predicate = 'read' | 'create' | 'update' | 'delete';

/**
 * Defines the valid values for the charset. It can only be one of the following: `UTF-8`, `UTF-16`, or `UTF-32`.
 */
export type Charset = `UTF-${'8' | '16' | '32'}`;

/**
 * Defines the type `Nil` that represents a value that can be either `null` or `undefined`.
 */
export type Nil = null | undefined;

/**
 * Defines the false value type that represents a value that can be either `false`, empty string `""`, number `0`、`NaN`, or `Nil` type.
 * But the bad thing is in typescript the `typeof NaN` is `number` type.
 */
export type FalseValue = false | '' | 0 | Nil; // Exclude<number, typeof NaN>;

/**
 * Defines the signature of a comparator function used for comparing values of type `T`.
 * It takes two parameters `pre` and `cur` of type `T` and returns a boolean value indicating the result of the comparison.
 */
export interface ComparatorFunc<T = unknown> {
  (pre: T, cur: T): boolean;
}

/**
 * Utility type.
 * Represents a constrained function interface that imposes constraints on the shape of a generic function
 */
export interface ConstrainedFunc<T extends (...args: any[]) => ReturnType<T>> {
  (...args: any[]): ReturnType<T>;
}

/**
 * Utility type.
 * It will output the key with value type `A` in `T`.
 */
export type ExtractKey<T, A> = {
  [K in keyof T]-?: T[K] extends A ? K : never;
}[keyof T];

/**
 * Utility type.
 * It will output keys with a value type other than `A` in `T`.
 */
export type ExcludeKey<T, A> = {
  [K in keyof T]-?: T[K] extends A ? never : K;
}[keyof T];

/**
 * Utility type.
 * It creates a new type by picking all properties from `T` except for the ones specified in `K`.
 */
export type OmitOf<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Utility type.
 * It creates a new type by omitting properties from `T` that have values assignable to `S`.
 */
export type OmitBy<T, S> = {
  [K in ExcludeKey<T, S>]: T[K];
};

/**
 * Utility type.
 * It creates a new type by picking all properties from `T` except for the ones that have a value of `Nil`.
 */
export type OmitNil<T> = Pick<T, ExcludeKey<T, Nil>>;

/**
 * Utility type.
 * It creates a new type by picking properties from `T` specified in `K` and making them optional.
 */
export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P];
};

/**
 * Utility type.
 */
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

/**
 * Utility type.
 * It creates a new type by checking if `A` extends `B`, and if true, returns `A`, otherwise returns `B`.
 */
export type Cast<A, B> = A extends B ? A : B;

/**
 * Utility type.
 * It creates a new type by checking if `A` extends an array with at least two elements,
 * and if true, returns the first element of `A`, otherwise returns `A`.
 */
export type Pop<A extends unknown[]> = A extends [infer B, unknown?] ? B : A;

/**
 * Utility type.
 * It creates a new type by splitting the string `A` by the delimiter `D` and storing the result in an `T[]`.
 */
type SplitCore<
  A extends string,
  D extends string,
  T extends string[] = [],
> = A extends `${infer P}${D}${infer S}`
  ? SplitCore<S, D, [...T, P]>
  : [...T, A];

/**
 * Utility type.
 * It creates a new type by calling `SplitCore` and removing the last element if `D` is an empty string.
 */
type SplitCall<A extends string, D extends string = ''> = D extends ''
  ? Pop<SplitCore<A, D>>
  : SplitCore<A, D>;

/**
 * Utility type.
 * It creates a new type by calling `SplitCall` and casting the result to string[] .
 */
export type Split<A extends string, D extends string = ','> =
  SplitCall<A, D> extends infer X ? Cast<X, string[]> : never;

/**
 * Define a type called Assemble that takes two type parameters:
 * - T: the object type being assembled
 * - K: the keys of the object type T that should be included in the assembled type
 */
export type Assemble<T, K extends keyof T = keyof T> = K extends string
  ? // If K is a string (i.e. not a union type), return either K or a recursive call to Assemble
    K | (T[K] extends object ? `${K}:${Assemble<T[K]>}` : never)
  : // Otherwise, return never
    never;

/**
 * Define a type called KeyPath that takes two type parameters:
 * - T: the object type being assembled
 * - P: a string literal type that represents the predicate for filtering keys of T
 */
export type KeyPath<
  T,
  P extends string = Predicate,
> = `${Assemble<T>}:${P | '*' | '!'}`;
