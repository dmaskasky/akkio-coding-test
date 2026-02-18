import type { ReactNode } from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientAtomProvider } from "jotai-tanstack-query/react";
import { SaturationLightnessControls } from "../src/components/SaturationLightnessControls";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientAtomProvider client={queryClient}>
        {children}
      </QueryClientAtomProvider>
    );
  };
}

describe("SaturationLightnessControls", () => {
  it("renders with initial saturation and lightness labels", () => {
    render(<SaturationLightnessControls />, {
      wrapper: createWrapper(),
    });
    expect(
      screen.getByLabelText(/saturation and lightness/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Saturation: 100%/)).toBeInTheDocument();
    expect(screen.getByText(/Lightness: 50%/)).toBeInTheDocument();
  });

  it("has accessible range inputs", () => {
    render(<SaturationLightnessControls />, {
      wrapper: createWrapper(),
    });
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute("id", "saturation-slider");
    expect(sliders[0]).toHaveAttribute("min", "0");
    expect(sliders[0]).toHaveAttribute("max", "100");
    expect(sliders[1]).toHaveAttribute("id", "lightness-slider");
    expect(sliders[1]).toHaveAttribute("min", "0");
    expect(sliders[1]).toHaveAttribute("max", "100");
  });

  it("updates label when saturation slider value changes", () => {
    render(<SaturationLightnessControls />, {
      wrapper: createWrapper(),
    });
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "75" } });
    expect(screen.getByText(/Saturation: 75%/)).toBeInTheDocument();
  });
});
