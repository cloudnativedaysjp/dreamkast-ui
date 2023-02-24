export function deepcopy<T>(src: T): T {
  return JSON.parse(JSON.stringify(src))
}
