import assert from "node:assert/strict";
import test from "node:test";
import { books, genres } from "../data/books.js";
import { filterBooks, getVisibleBooks, getWishlistBooks, sortBooks } from "../lib/books.js";

const sampleBooks = [
  { id: "b", title: "Архипелаг над облаками", author: "Ая Мори", year: 2020, genre: "fantasy", rating: 4.4, available: true },
  { id: "a", title: "Библиотека дождя", author: "Нао Кимура", year: 2024, genre: "drama", rating: 4.9, available: false },
  { id: "c", title: "Заводная лисица", author: "Ая Мори", year: 2022, genre: "action", rating: 4.8, available: false },
];

test("search matches title and author without case sensitivity", () => {
  assert.deepEqual(filterBooks(sampleBooks, { query: "МОРИ", genre: "all", availableOnly: false }), [sampleBooks[0], sampleBooks[2]]);
  assert.deepEqual(filterBooks(sampleBooks, { query: "БИБЛИОТЕКА", genre: "all", availableOnly: false }), [sampleBooks[1]]);
});

test("genre and availability filters combine", () => {
  assert.deepEqual(filterBooks(sampleBooks, { query: "", genre: "fantasy", availableOnly: true }), [sampleBooks[0]]);
});

test("sorting returns a new array for title, year, and rating orders", () => {
  const originalOrder = sampleBooks.map((book) => book.id);
  assert.deepEqual(sortBooks(sampleBooks, "title").map((book) => book.id), ["b", "a", "c"]);
  assert.deepEqual(sortBooks(sampleBooks, "year").map((book) => book.id), ["a", "c", "b"]);
  assert.deepEqual(sortBooks(sampleBooks, "rating").map((book) => book.id), ["a", "c", "b"]);
  assert.deepEqual(sampleBooks.map((book) => book.id), originalOrder);
});

test("combined selection and wishlist preserve the source collection", () => {
  const source = [...sampleBooks];
  const visible = getVisibleBooks(source, { query: "", genre: "all", availableOnly: false, sortBy: "rating" });
  assert.deepEqual(visible.map((book) => book.id), ["a", "c", "b"]);
  assert.deepEqual(getWishlistBooks(source, ["b", "a"]), [sampleBooks[0], sampleBooks[1]]);
  assert.deepEqual(source, sampleBooks);
});

test("the MangaNest sample collection contains 40 unique series across five genres", () => {
  assert.equal(books.length, 40);
  assert.equal(new Set(books.map((book) => book.id)).size, 40);
  assert.equal(genres.length, 5);
  assert.deepEqual(new Set(books.map((book) => book.genre)), new Set(genres.map((genre) => genre.id)));
});
