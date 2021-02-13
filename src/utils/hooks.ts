import { useEffect, useRef } from 'react';

interface TimeoutHandler<T> {
  setTimeout: (fn: () => void, timeout: number) => T;
  clearTimeout: (timeout: T | undefined) => void;
}
type CancelTimer = () => void;
type UseTimeout = (
  callback: () => void,
  timeout: number,
  deps?: unknown[]
) => CancelTimer;

const defaultTimeoutHandler: TimeoutHandler<number> = {
  setTimeout: (fn: () => void, timeout: number) => window.setTimeout(fn, timeout),
  clearTimeout: (timeout: number | undefined) => {
    window.clearTimeout(timeout);
  },
};

/**
 * useTimeout is a React.js custom hook that sets a leak-safe timeout and returns
 * a function to cancel it before the timeout expires.
 * It's composed of two other native hooks, useRef and useEffect.
 * The timer is restarted every time an item in `deps` changes.
 * If a new callback is given to the hook before the previous timeout expires,
 * only the new callback will be executed at the moment the timeout expires.
 * When the hook receives a new callback, the timeout isn't reset.
 * @param callback the function to be executed after the timeout expires
 * @param timeout the number of milliseconds after which the callback should be triggered
 * @param deps useEffect dependencies that should cause the timeout to be reset
 * @return function to cancel the timer before the timeout expires
 */
export const useTimeout: UseTimeout = (callback, timeout, deps = []) => {
  const timeHandler = defaultTimeoutHandler;
  const refCallback = useRef<() => void>();
  const refTimer = useRef<typeof timeHandler extends TimeoutHandler<infer R> ? R : never | undefined>();

  useEffect(() => {
    refCallback.current = callback;
  }, [callback]);

  /**
   * The timer is restarted every time an item in `deps` changes.
   */
  useEffect(() => {
    const timerID = timeHandler.setTimeout(refCallback.current!, timeout);
    refTimer.current = timerID;

    // cleans the timer identified by timerID when the effect is unmounted.
    return () => timeHandler.clearTimeout(timerID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  /**
   * Returns a function that can be used to cancel the current timeout.
   * It does so using `timeHandler.clearTimeout` without exposing the last
   * reference to the timer to the user.
   */
  function cancelTimer() {
    return timeHandler.clearTimeout(refTimer.current);
  }

  return cancelTimer;
};
