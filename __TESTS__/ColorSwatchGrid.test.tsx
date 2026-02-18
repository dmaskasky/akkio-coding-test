import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { useHydrateAtoms } from "jotai/react/utils";
import { QueryClientAtomProvider } from "jotai-tanstack-query/react";
import {
  debouncedSaturationAtom,
  debouncedLightnessAtom,
} from "../src/atoms/colorSwatches";
import { ColorSwatchGrid } from "../src/components/ColorSwatchGrid";
import * as colorApi from "../src/api/colorApi";

vi.mock("../src/components/ColorSwatch", () => ({
  ColorSwatch: ({ swatch }: { swatch: { name: string } }) => (
    <div data-testid="swatch">{swatch.name}</div>
  ),
}));

function createWrapper(saturation: number, lightness: number) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Hydrate({ children }: { children: ReactNode }) {
    useHydrateAtoms([
      [debouncedSaturationAtom, saturation],
      [debouncedLightnessAtom, lightness],
    ]);
    return <>{children}</>;
  }
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientAtomProvider client={queryClient}>
        <Hydrate>{children}</Hydrate>
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

describe("ColorSwatchGrid", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading message when no swatches yet", () => {
    vi.spyOn(colorApi, "fetchColorByHsl").mockImplementation(
      () =>
        new Promise(() => {}) as ReturnType<typeof colorApi.fetchColorByHsl>,
    );
    render(<ColorSwatchGrid />, {
      wrapper: createWrapper(100, 50),
    });
    expect(screen.getByText(/Loading color swatches/)).toBeInTheDocument();
  });

  it("shows region with aria-live and aria-busy", async () => {
    vi.spyOn(colorApi, "fetchColorByHsl").mockImplementation((h) =>
      Promise.resolve(
        mockApiResponse(
          "Red",
          `#${Math.round(h).toString(16).padStart(2, "0")}0000`,
        ),
      ),
    );
    render(<ColorSwatchGrid />, {
      wrapper: createWrapper(100, 50),
    });
    const region = screen.getByRole("region", { name: /color swatch grid/i });
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-busy", "true");
    await waitFor(() => {
      expect(region).toHaveAttribute("aria-busy", "false");
    });
  });

  it("renders swatch list when data is loaded", async () => {
    vi.spyOn(colorApi, "fetchColorByHsl").mockImplementation((h) =>
      Promise.resolve(
        mockApiResponse(
          "Red",
          `#${Math.round(h).toString(16).padStart(2, "0")}0000`,
        ),
      ),
    );
    render(<ColorSwatchGrid />, {
      wrapper: createWrapper(100, 50),
    });
    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
    expect(screen.getByRole("list").children.length).toBeGreaterThan(0);
  });
});
