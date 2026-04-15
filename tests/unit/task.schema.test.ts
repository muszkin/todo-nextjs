import { describe, expect, it } from "vitest";
import { createTaskInput, updateTaskInput } from "@/lib/schemas/task";

describe("createTaskInput", () => {
  it("accepts valid payload and coerces dueAt string to Date", () => {
    const parsed = createTaskInput.parse({
      title: "buy milk",
      dueAt: "2026-04-20T10:00:00Z",
    });
    expect(parsed.title).toBe("buy milk");
    expect(parsed.dueAt).toBeInstanceOf(Date);
  });

  it("rejects empty title", () => {
    expect(() => createTaskInput.parse({ title: "  ", dueAt: new Date() })).toThrow();
  });

  it("rejects missing dueAt", () => {
    expect(() => createTaskInput.parse({ title: "x" })).toThrow();
  });
});

describe("updateTaskInput", () => {
  it("accepts partial status update", () => {
    const parsed = updateTaskInput.parse({ status: "done" });
    expect(parsed.status).toBe("done");
  });

  it("rejects empty object", () => {
    expect(() => updateTaskInput.parse({})).toThrow();
  });

  it("rejects invalid status", () => {
    expect(() => updateTaskInput.parse({ status: "archived" })).toThrow();
  });
});
