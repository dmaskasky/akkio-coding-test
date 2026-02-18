import { atom, type SetStateAction } from "jotai";

/**
 * Creates atoms where writes are debounced. Useful for inputs that drive
 * derived/async state (e.g. search) so updates fire after the user pauses.
 * Based on Jotai recipe: https://jotai.org/docs/recipes/atom-with-debounce
 */
export function atomWithDebounce<T>(
  initialValue: T,
  delayMilliseconds = 500,
  shouldDebounceOnReset = false,
) {
  const prevTimeoutAtom = atom<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const _currentValueAtom = atom(initialValue);
  const isDebouncingAtom = atom(false);
  const debouncedValueAtom = atom(
    initialValue,
    (get, set, update: SetStateAction<T>) => {
      clearTimeout(get(prevTimeoutAtom));
      const prevValue = get(_currentValueAtom);
      const nextValue =
        typeof update === "function"
          ? (update as (prev: T) => T)(prevValue)
          : update;

      const onDebounceStart = () => {
        set(_currentValueAtom, nextValue);
        set(isDebouncingAtom, true);
      };
      const onDebounceEnd = () => {
        set(debouncedValueAtom, nextValue);
        set(isDebouncingAtom, false);
      };

      onDebounceStart();
      if (!shouldDebounceOnReset && nextValue === initialValue) {
        onDebounceEnd();
        return;
      }
      const nextTimeoutId = setTimeout(() => {
        onDebounceEnd();
      }, delayMilliseconds);
      set(prevTimeoutAtom, nextTimeoutId);
    },
  );

  return {
    currentValueAtom: atom((get) => get(_currentValueAtom)),
    isDebouncingAtom,
    debouncedValueAtom,
  };
}
