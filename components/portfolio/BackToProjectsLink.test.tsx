import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it.each(["", "/", "/portfolio", " portfolio/ "])("preserves the project anchor with base path %j", async (basePath) => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", basePath);
  vi.resetModules();
  const { BackToProjectsLink } = await import("./BackToProjectsLink");
  render(<BackToProjectsLink />);
  const normalized = basePath.trim().replace(/^\/+|\/+$/g, "");
  const href = screen.getByRole("link", { name: /back to projects/i }).getAttribute("href")!;
  const url = new URL(href, "https://example.com");
  expect(url.pathname).toBe(normalized ? `/${normalized}/` : "/");
  expect(url.hash).toBe("#projects");
});
