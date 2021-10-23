interface Storage {
  setItem(string, string): void
  getItem(string): string
  removeItem(string): string
}

interface Window {
  tracker: Array
  [key: string]: Storage
}
