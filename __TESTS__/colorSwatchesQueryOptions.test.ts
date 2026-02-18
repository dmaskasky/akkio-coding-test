import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { colorSwatchesQueryOptions } from "../src/queries/colorSwatches";
import * as colorApi from "../src/api/colorApi";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe("colorSwatchesQueryOptions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns options with queryKey containing saturation and lightness", () => {
    const options = colorSwatchesQueryOptions(100, 50);
    expect(options.queryKey).toEqual(["colorSwatches", 100, 50]);
  });

  it("queryFn fetches and deduplicates by name", async () => {
    const mockRes = (name: string, hex: string, s: number, l: number) => ({
      hex: { value: hex, clean: hex.replace("#", "") },
      rgb: {
        fraction: { r: 1, g: 0, b: 0 },
        r: 255,
        g: 0,
        b: 0,
        value: "rgb(255,0,0)",
      },
      hsl: {
        fraction: { h: 0, s: s / 100, l: l / 100 },
        h: 0,
        s,
        l,
        value: `hsl(0,${s}%,${l}%)`,
      },
      name: {
        value: name,
        closest_named_hex: hex,
        exact_match_name: true,
        distance: 0,
      },
    });
    vi.spyOn(colorApi, "fetchColorByHsl").mockImplementation((h, s, l) => {
      return Promise.resolve(
        mockRes(`Color-${h}`, `#${String(h).padStart(2, "0")}0000`, s, l),
      );
    });

    const options = colorSwatchesQueryOptions(80, 60);
    const data = await queryClient.fetchQuery(options);

    expect(data.length).toBeGreaterThan(0);
    expect(data.every((s) => s.hsl.s === 80 && s.hsl.l === 60)).toBe(true);
    const names = new Set(data.map((s) => s.name));
    expect(names.size).toBe(data.length);
  });
});
