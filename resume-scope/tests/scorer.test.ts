import { describe, expect, it } from "vitest";
import { calculateMatchScore } from "@/lib/scorer";

describe("calculateMatchScore", () => {
  const cases: [string, number, number, number][] = [
    ["zero total weight", 0, 0, 0],
    ["zero total with matched weight", 5, 0, 0],
    ["negative total weight", 3, -2, 0],
    ["nothing matched", 0, 10, 0],
    ["everything matched", 10, 10, 100],
    ["rounds down below .5", 1, 3, 33],
    ["rounds up at .5 and above", 2, 3, 67],
    ["half", 5, 10, 50],
    ["fractional weights", 15, 19.5, 77],
    ["caps at 100 when matched exceeds total", 12, 10, 100],
    ["negative matched weight clamps to 0", -4, 10, 0],
    ["NaN matched", Number.NaN, 10, 0],
    ["Infinity total", 5, Number.POSITIVE_INFINITY, 0],
  ];

  it.each(cases)("%s", (_name, matched, total, expected) => {
    expect(calculateMatchScore(matched, total)).toBe(expected);
  });
});
