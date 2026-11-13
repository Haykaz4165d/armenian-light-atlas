import { describe, expect, it } from "vitest";
import { narratedSlides, narrations, sentenceAt, sentences } from "@/lib/narrations";

describe("talking narrators", () => {
  it("places each of the 11 narrations on exactly one slide", () => {
    const used = Object.values(narratedSlides);
    expect(used).toHaveLength(11);
    expect(new Set(used)).toEqual(new Set(Object.keys(narrations)));
  });

  it("gives every narrator a talking video and a voice recording", () => {
    for (const n of Object.values(narrations)) {
      expect(n.narrator.video).toMatch(/\.mp4$/);
      expect(n.audio).toMatch(/\.mp3$/);
    }
  });

  it("moves the caption to the next sentence as the voice plays", () => {
    const parts = sentences("Առաջին։ Երկրորդ։");
    expect(parts).toEqual(["Առաջին։", "Երկրորդ։"]);
    expect(sentenceAt(parts, 1, 10)).toBe(0);
    expect(sentenceAt(parts, 9, 10)).toBe(1);
  });
});
