import { queryOptions } from "@tanstack/react-query";
import {
  fetchColorByHsl,
  toSwatch,
  type ColorSwatchData,
} from "../api/colorApi";
import { runWithConcurrency } from "../utils/concurrency";

const HUE_MAX = 360;
const HUE_STEP = 10;
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
    placeholderData: (previousData) => previousData,
  });
}
