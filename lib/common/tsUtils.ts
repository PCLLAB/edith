export type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

/**
 * Omits properties that have type `never`. Utilizes key-remapping introduced in
 * TS4.1.
 */
export type OmitNever<T extends Record<string, unknown>> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

/**
 * Constructs a Record type that only includes shared properties between `A` and
 * `B`. If the value of a key is different in `A` and `B`, `Common<A,
 * B>` attempts to choose a type that is assignable to the types of both values.
 */
export type Common<A, B> = OmitNever<Pick<A & B, keyof A & keyof B>>;
