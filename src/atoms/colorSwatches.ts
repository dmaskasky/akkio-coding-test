import { atom, type Atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { atomWithDebounce } from "../utils/atomWithDebounce";
import { colorSwatchesQueryOptions } from "../queries/colorSwatches";
import type { ColorSwatchData } from "../api/colorApi";

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

/** True when the user has changed S or L but the debounced value has not yet updated. */
export const hasPendingInputAtom: Atom<boolean> = atom((get) =>
  Boolean(
    get(saturationAtom) !== get(debouncedSaturationAtom) ||
    get(lightnessAtom) !== get(debouncedLightnessAtom),
  ),
);

/** True when a fetch is in progress or the user has pending slider input. */
export const showSpinnerAtom: Atom<boolean> = atom(
  (get) => get(colorSwatchesQueryAtom).isFetching || get(hasPendingInputAtom),
);

export type ColorSwatchesGridState = {
  swatches: ColorSwatchData[];
  hasSwatches: boolean;
  errorMessage: string | null;
  isPending: boolean;
};

/** Derived state for the color swatch grid; encapsulates query → display logic. */
export const colorSwatchesGridStateAtom: Atom<ColorSwatchesGridState> = atom(
  (get) => {
    const query = get(colorSwatchesQueryAtom);
    const { data, isPending, error } = query;
    const swatches = data ?? [];
    const hasSwatches = swatches.length > 0;
    const errorMessage =
      error instanceof Error
        ? error.message
        : error
          ? "Failed to load colors"
          : null;
    return { swatches, hasSwatches, errorMessage, isPending };
  },
);
