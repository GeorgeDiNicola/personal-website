import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { OpenLibraryBooksSection } from "./OpenLibraryBooksSection";

const data = vi.hoisted(() => ({
  username: "reader",
  shelves: {
    "currently-reading": { books: [] as Book[], totalCount: 0 },
    read: { books: [] as Book[], totalCount: 0 },
  },
}));

type Book = {
  key: string; href: string; title: string; authors: string[];
  coverUrl: string | null; firstPublishYear: number | null; readOrder: number;
};

vi.mock("./open-library-books.generated.json", () => ({ default: data }));

beforeEach(() => {
  const books: Book[] = Array.from({ length: 3 }, (_, index) => ({
    key: `book-${index}`, href: index === 0 ? "/works/example" : "https://openlibrary.org/works/other",
    title: `Fixture book ${index}`, authors: index ? [] : ["Fixture Author"],
    coverUrl: index ? null : "https://covers.openlibrary.org/example.jpg",
    firstPublishYear: index ? null : 2000, readOrder: index,
  }));
  data.shelves["currently-reading"] = { books: [...books], totalCount: 3 };
  data.shelves.read = { books: [...books], totalCount: 0 };
});

it.each([false, true])("paginates each shelf independently without duplicates (dark=%s)", async (isDark) => {
  const user = userEvent.setup();
  render(<OpenLibraryBooksSection isDark={isDark} username="reader" limitPerShelf={2} />);
  expect(screen.getAllByRole("link")).toHaveLength(4);
  const buttons = screen.getAllByRole("button", { name: /load more/i });
  await user.click(buttons[0]);
  expect(screen.getAllByRole("link")).toHaveLength(5);
  expect(screen.getAllByRole("button", { name: /load more/i })).toHaveLength(1);
  await user.click(buttons[1]);
  expect(screen.getAllByRole("link")).toHaveLength(6);
  expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
  for (const list of screen.getAllByRole("list")) {
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  }
});

it("uses safe cover fallbacks and resolves relative book destinations", () => {
  render(<OpenLibraryBooksSection isDark={false} username="reader" />);
  const images = screen.getAllByRole("img");
  fireEvent.error(images[0]);
  expect(images[0]).toHaveAttribute("src", expect.stringContaining("placeholder"));
  expect(images[1]).toHaveAttribute("src", expect.stringContaining("placeholder"));
  expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", "https://openlibrary.org/works/example");
  expect(screen.getAllByRole("link")[1]).toHaveAttribute("href", "https://openlibrary.org/works/other");
});

it("renders an empty shelf and handles completely missing book data", () => {
  data.shelves.read = { books: [], totalCount: 0 };
  const { unmount } = render(<OpenLibraryBooksSection isDark={false} username="" />);
  expect(screen.getAllByRole("list")).toHaveLength(1);
  unmount();
  data.shelves["currently-reading"] = { books: [], totalCount: 0 };
  render(<OpenLibraryBooksSection isDark={false} username="different-reader" />);
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.getByText(/no generated.*books/i)).toBeInTheDocument();
});
