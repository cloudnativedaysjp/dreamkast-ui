import { useState } from 'react'

//export const useStateWithLocalStorage = <T>(key: string): ([T, (value: T | ((val: T) => T)) => void]) => {
export default function useStateWithLocalStorage<T>(
  key: string,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key)
    //return item ? JSON.parse(item) : initialValue;
    return item ? JSON.parse(item) : ''
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue]
}
