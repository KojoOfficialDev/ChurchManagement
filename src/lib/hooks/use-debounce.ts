import { startTransition, useCallback, useEffect, useState } from 'react'

/**
 * A custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setDebouncedValue(value)
      })
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * A custom hook that debounces a callback function
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback function
 */
export function useDebouncedCallback<
  T extends (...args: Array<unknown>) => unknown,
>(callback: T, delay: number, deps: React.DependencyList = []): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback)

  const memoizedCallback = useCallback(callback, deps)

  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setDebouncedCallback(() => memoizedCallback)
      })
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [memoizedCallback, delay])

  return debouncedCallback
}
