import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createStore } from "jotai";
import { atomWithDebounce } from "../src/utils/atomWithDebounce";

describe("atomWithDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value for currentValueAtom and debouncedValueAtom", () => {
    const { currentValueAtom, debouncedValueAtom } = atomWithDebounce(42, 100);
    const store = createStore();
    expect(store.get(currentValueAtom)).toBe(42);
    expect(store.get(debouncedValueAtom)).toBe(42);
  });

  it("updates currentValueAtom immediately when debouncedValueAtom is set", () => {
    const { currentValueAtom, debouncedValueAtom } = atomWithDebounce(0, 200);
    const store = createStore();
    store.set(debouncedValueAtom, 10);
    expect(store.get(currentValueAtom)).toBe(10);
    expect(store.get(debouncedValueAtom)).toBe(0);
  });

  it("updates debouncedValueAtom after delay", () => {
    const { debouncedValueAtom } = atomWithDebounce(0, 200);
    const store = createStore();
    store.set(debouncedValueAtom, 10);
    expect(store.get(debouncedValueAtom)).toBe(0);
    vi.advanceTimersByTime(200);
    expect(store.get(debouncedValueAtom)).toBe(10);
  });

  it("resets timer on rapid writes and only applies last value after delay", () => {
    const { debouncedValueAtom } = atomWithDebounce(0, 200);
    const store = createStore();
    store.set(debouncedValueAtom, 1);
    vi.advanceTimersByTime(50);
    store.set(debouncedValueAtom, 2);
    vi.advanceTimersByTime(50);
    store.set(debouncedValueAtom, 3);
    expect(store.get(debouncedValueAtom)).toBe(0);
    vi.advanceTimersByTime(199);
    expect(store.get(debouncedValueAtom)).toBe(0);
    vi.advanceTimersByTime(1);
    expect(store.get(debouncedValueAtom)).toBe(3);
  });

  it("supports functional updates", () => {
    const { currentValueAtom, debouncedValueAtom } = atomWithDebounce(5, 100);
    const store = createStore();
    store.set(debouncedValueAtom, (prev) => prev + 10);
    expect(store.get(currentValueAtom)).toBe(15);
    vi.advanceTimersByTime(100);
    expect(store.get(debouncedValueAtom)).toBe(15);
  });

  it("sets isDebouncingAtom true while waiting", () => {
    const { isDebouncingAtom, debouncedValueAtom } = atomWithDebounce(0, 200);
    const store = createStore();
    expect(store.get(isDebouncingAtom)).toBe(false);
    store.set(debouncedValueAtom, 1);
    expect(store.get(isDebouncingAtom)).toBe(true);
    vi.advanceTimersByTime(200);
    expect(store.get(isDebouncingAtom)).toBe(false);
  });
});
