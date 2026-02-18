import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/react/utils";
import { QueryClientAtomProvider } from "jotai-tanstack-query/react";
import {
  colorSwatchesQueryAtom,
  debouncedSaturationAtom,
  debouncedLightnessAtom,
} from "../src/atoms/colorSwatches";
import * as colorApi from "../src/api/colorApi";

function createWrapper(saturation: number, lightness: number) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function HydrateAtoms({ children }: { children: ReactNode }) {
    useHydrateAtoms([
      [debouncedSaturationAtom, saturation],
      [debouncedLightnessAtom, lightness],
    ]);
    return <>{children}</>;
  }
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientAtomProvider client={queryClient}>
        <HydrateAtoms>{children}</HydrateAtoms>
      </QueryClientAtomProvider>
    );
  };
}

const mockApiResponse = (name: string, hex: string) => ({
  hex: { value: hex, clean: hex.replace("#", "") },
  rgb: {
    fraction: { r: 1, g: 0, b: 0 },
    r: 255,
    g: 0,
    b: 0,
    value: "rgb(255,0,0)",
  },
  hsl: {
    fraction: { h: 0, s: 1, l: 0.5 },
    h: 0,
    s: 100,
    l: 50,
    value: "hsl(0,100%,50%)",
  },
  name: {
    value: name,
    closest_named_hex: hex,
    exact_match_name: true,
    distance: 0,
  },
});

describe("colorSwatchesQueryAtom", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("for S = 100% and L = 50%, fetches with correct HSL and returns distinct named swatches", async () => {
    const saturation = 100;
    const lightness = 50;

    const namesByHue = [
      "Red",
      "Scarlet",
      "Vermilion",
      "Amber",
      "Gold",
      "Yellow",
      "Lime",
      "Green",
      "Cyan",
      "Blue",
      "Violet",
      "Magenta",
    ];
    let callIndex = 0;
    vi.spyOn(colorApi, "fetchColorByHsl").mockImplementation((h, s, l) => {
      expect(s).toBe(saturation);
      expect(l).toBe(lightness);
      const name = namesByHue[callIndex % namesByHue.length];
      callIndex += 1;
      return Promise.resolve(
        mockApiResponse(
          name,
          `#${Math.round(h).toString(16).padStart(2, "0")}0000`,
        ),
      );
    });

    const { result } = renderHook(() => useAtomValue(colorSwatchesQueryAtom), {
      wrapper: createWrapper(saturation, lightness),
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.error).toBe(null);
    const swatches = result.current.data ?? [];
    expect(swatches.length).toBeGreaterThan(0);
    expect(swatches.length).toBeLessThanOrEqual(namesByHue.length);

    const uniqueNames = new Set(swatches.map((s) => s.name));
    expect(uniqueNames.size).toBe(swatches.length);

    swatches.forEach((swatch) => {
      expect(swatch.name).toBeDefined();
      expect(swatch.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(swatch.hsl.s).toBe(saturation);
      expect(swatch.hsl.l).toBe(lightness);
    });

    expect(colorApi.fetchColorByHsl).toHaveBeenCalledWith(
      expect.any(Number),
      saturation,
      lightness,
    );
  });
});
