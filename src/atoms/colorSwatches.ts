import { atomWithQuery } from "jotai-tanstack-query";
import { atomWithDebounce } from "../utils/atomWithDebounce";
import { colorSwatchesQueryOptions } from "../queries/colorSwatches";

const DEBOUNCE_MS = 400;

const saturationDebounce = atomWithDebounce(100, DEBOUNCE_MS);
const lightnessDebounce = atomWithDebounce(50, DEBOUNCE_MS);

/** Current slider value (updates immediately). */
export const saturationAtom = saturationDebounce.currentValueAtom;
/** Current slider value (updates immediately). */
export const lightnessAtom = lightnessDebounce.currentValueAtom;

/** Debounced value used for the query. Write here from controls to trigger debounced update. */
export const debouncedSaturationAtom = saturationDebounce.debouncedValueAtom;
/** Debounced value used for the query. */
export const debouncedLightnessAtom = lightnessDebounce.debouncedValueAtom;

export const colorSwatchesQueryAtom = atomWithQuery((get) =>
  colorSwatchesQueryOptions(
    get(debouncedSaturationAtom),
    get(debouncedLightnessAtom),
  ),
);
