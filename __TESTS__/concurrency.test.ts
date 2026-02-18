import { describe, it, expect } from "vitest";
import { runWithConcurrency } from "../src/utils/concurrency";

describe("runWithConcurrency", () => {
  it("returns results in same order as input items", async () => {
    const items = [1, 2, 3, 4, 5];
    const results = await runWithConcurrency(items, 2, (x) =>
      Promise.resolve(x * 10),
    );
    expect(results).toEqual([10, 20, 30, 40, 50]);
  });

  it("limits concurrent execution", async () => {
    const order: number[] = [];
    const items = [1, 2, 3, 4, 5];
    await runWithConcurrency(items, 2, async (x, i) => {
      order.push(i);
      await new Promise((r) => setTimeout(r, 10));
      return x;
    });
    expect(order.length).toBe(5);
    expect(order[0]).toBe(0);
    expect(order[1]).toBe(1);
    expect([order[2], order[3]]).toContain(2);
    expect([order[2], order[3]]).toContain(3);
  });

  it("handles empty items", async () => {
    const results = await runWithConcurrency([], 3, () => Promise.resolve("x"));
    expect(results).toEqual([]);
  });

  it("propagates errors", async () => {
    await expect(
      runWithConcurrency([1, 2, 3], 2, (x) =>
        x === 2 ? Promise.reject(new Error("fail")) : Promise.resolve(x),
      ),
    ).rejects.toThrow("fail");
  });
});
