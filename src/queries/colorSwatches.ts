import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  fetchColorByHsl,
  toSwatch,
  type ColorSwatchData,
} from "../api/colorApi";
import { runWithConcurrency } from "../utils/concurrency";

/**
 * Distinct names are determined by:
 * 1. Sampling the hue circle at fixed steps (one API call per step).
 * 2. Deduplicating by color name; the API returns the closest named color per (h,s,l).
 *
 * The Color API has no batch endpoint—each request returns one color—so the only way
 * to reduce calls is to use a larger HUE_STEP (fewer samples). Tradeoff: fewer calls
 * vs. possibly missing some distinct names that fall between steps.
 */
const HUE_MAX = 360;
const HUE_STEP = 15; // 24 calls; use 10 for ~36 calls and better name coverage
const CONCURRENCY = 8;

function hueSteps(): number[] {
  const steps: number[] = [];
  for (let h = 0; h < HUE_MAX; h += HUE_STEP) {
    steps.push(h);
  }
  return steps;
}

async function fetchSwatches(
  saturation: number,
  lightness: number,
): Promise<ColorSwatchData[]> {
  const hues = hueSteps();
  const responses = await runWithConcurrency(hues, CONCURRENCY, (h) =>
    fetchColorByHsl(h, saturation, lightness),
  );
  const byName = new Map<string, ColorSwatchData>();
  for (const res of responses) {
    const swatch = toSwatch(res);
    if (!byName.has(swatch.name)) {
      byName.set(swatch.name, swatch);
    }
  }
  return Array.from(byName.values());
}

export function colorSwatchesQueryOptions(
  saturation: number,
  lightness: number,
) {
  return queryOptions({
    queryKey: ["colorSwatches", saturation, lightness] as const,
    queryFn: () => fetchSwatches(saturation, lightness),
    placeholderData: keepPreviousData,
  });
}
