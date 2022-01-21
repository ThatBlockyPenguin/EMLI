export interface IDeprecatable {
  trial?: boolean,
  unstable?: boolean,
  deprecated?: boolean,
  position: string,
}

export function isIDep(obj: unknown): obj is IDeprecatable {
  // deno-lint-ignore no-prototype-builtins
  return obj instanceof Object && obj.hasOwnProperty('deprecated');
}