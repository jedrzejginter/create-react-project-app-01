type DropNever<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];

export type JSXComponentProps<T extends keyof JSX.IntrinsicElements, P extends object = {}> = Omit<
  JSX.IntrinsicElements[T],
  keyof P
> &
  Pick<P, DropNever<P>>;
