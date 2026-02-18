import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  toSwatch,
  colorApiIdUrl,
  colorApiSchemeUrl,
  type ColorApiResponse,
} from "../src/api/colorApi";

const mockApiResponse = (name: string, hex: string): ColorApiResponse => ({
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

describe("toSwatch", () => {
  it("maps API response to ColorSwatchData", () => {
    const res = mockApiResponse("Red", "#FF0000");
    const swatch = toSwatch(res);
    expect(swatch).toEqual({
      name: "Red",
      hex: "#FF0000",
      rgb: { r: 255, g: 0, b: 0 },
      hsl: { h: 0, s: 100, l: 50 },
    });
  });
});

describe("colorApiIdUrl", () => {
  it("returns id URL with hex and default format html", () => {
    expect(colorApiIdUrl("00FF00")).toBe(
      "https://www.thecolorapi.com/id?format=html&hex=00FF00",
    );
  });
  it("accepts format json", () => {
    expect(colorApiIdUrl("00FF00", "json")).toBe(
      "https://www.thecolorapi.com/id?format=json&hex=00FF00",
    );
  });
  it("encodes hex in URL", () => {
    const url = colorApiIdUrl("00FF00");
    expect(url).toContain("hex=00FF00");
  });
});

describe("colorApiSchemeUrl", () => {
  it("returns scheme URL with hex", () => {
    expect(colorApiSchemeUrl("00FF00")).toBe(
      "https://www.thecolorapi.com/scheme?hex=00FF00&format=html",
    );
  });
});

describe("fetchColorByHsl", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws on non-ok response", async () => {
    const api = await import("../src/api/colorApi");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );
    await expect(api.fetchColorByHsl(0, 100, 50)).rejects.toThrow(
      "Color API error: 500",
    );
  });
});

describe("fetchColorByHex", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("strips # from hex and requests with clean hex", async () => {
    const api = await import("../src/api/colorApi");
    const mockJson = vi
      .fn()
      .mockResolvedValue(mockApiResponse("Green", "#00FF00"));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: mockJson }),
    );
    await api.fetchColorByHex("#00FF00");
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("hex=00FF00"));
  });
});
