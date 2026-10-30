import { books, genres } from "../../data/books.js";
import { getVisibleBooks, getWishlistBooks } from "../../lib/books.js";

const form = document.querySelector(".filters-form");
const listing = document.querySelector(".book-listing");
const resultsCount = document.querySelector("#results-count");
const wishlistList = document.querySelector("#wishlist-list");
const wishlistCount = document.querySelector("#wishlist-count");
const storageKey = "manganest.lab3.wishlist.v1";
const coverIds = ["sky-archipelago", "clockwork-fox", "library-rain", "moon-train", "paper-dragon", "summer-comet"];
const coverFiles = ["sky-archipelago", "clockwork-fox", "library-rain", "moon-train", "paper-dragon", "summer-comet"];
let wishlist = readWishlist();

function readWishlist() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(value) ? value.filter((id) => books.some((book) => book.id === id)) : [];
  } catch {
    return [];
  }
}

function saveWishlist() {
  try { localStorage.setItem(storageKey, JSON.stringify(wishlist)); } catch { /* Список продолжит работать до закрытия вкладки. */ }
}

function make(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeCard(book) {
  const article = make("article", "book-card");
  const figure = make("figure", "book-card__figure");
  if (coverIds.includes(book.id)) {
    const coverIndex = coverIds.indexOf(book.id);
    const image = make("img", "book-card__cover");
    image.src = `../../assets/covers/${coverFiles[coverIndex]}.svg`;
    image.alt = `Обложка манги «${book.title}»`;
    image.width = 320;
    image.height = 480;
    figure.append(image);
  } else {
    figure.append(make("span", "book-card__cover-placeholder", "Обложка серии"));
  }
  const header = make("header", "book-card__header");
  header.append(make("h3", "book-card__title", book.title), make("p", "book-card__meta", book.author));
  article.append(figure, header, make("p", "book-card__summary", `${genres.find((genre) => genre.id === book.genre)?.label ?? "Манга"} · ${book.year} год · рейтинг ${book.rating.toFixed(1)}`));
  const action = make("p", "book-card__action");
  const save = make("button", "wishlist-toggle", wishlist.includes(book.id) ? "В списке для чтения" : "Хочу прочитать");
  save.type = "button";
  save.dataset.bookId = book.id;
  save.dataset.action = "toggle";
  save.setAttribute("aria-pressed", String(wishlist.includes(book.id)));
  action.append(save);
  article.append(action);
  return article;
}

function renderWishlist() {
  const saved = getWishlistBooks(books, wishlist);
  wishlistCount.textContent = String(saved.length);
  wishlistList.replaceChildren();
  if (saved.length === 0) {
    wishlistList.append(make("li", "wishlist-empty", "Список пуст. Добавьте мангу из каталога."));
    return;
  }
  saved.forEach((book) => {
    const entry = make("li", "wishlist-entry");
    entry.append(make("span", "wishlist-entry__title", `${book.title} — ${book.author}`));
    const remove = make("button", "wishlist-remove", "Удалить");
    remove.type = "button";
    remove.dataset.action = "remove";
    remove.dataset.bookId = book.id;
    remove.setAttribute("aria-label", `Удалить «${book.title}» из списка`);
    entry.append(remove);
    wishlistList.append(entry);
  });
}

function renderCatalog() {
  const data = new FormData(form);
  const visible = getVisibleBooks(books, {
    query: String(data.get("q") ?? ""),
    genre: String(data.get("genre") ?? "all"),
    availableOnly: data.get("available") === "on",
    sortBy: String(data.get("sort") ?? "title"),
  });
  listing.replaceChildren(...visible.map(makeCard));
  resultsCount.textContent = `Показано серий: ${visible.length} из ${books.length}.`;
  renderWishlist();
}

form.addEventListener("input", renderCatalog);
form.addEventListener("change", renderCatalog);
form.addEventListener("reset", () => window.setTimeout(renderCatalog, 0));
document.querySelector("#catalog-app").addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, bookId } = button.dataset;
  if (action === "toggle") wishlist = wishlist.includes(bookId) ? wishlist.filter((id) => id !== bookId) : [...wishlist, bookId];
  if (action === "remove") wishlist = wishlist.filter((id) => id !== bookId);
  saveWishlist();
  renderCatalog();
});

renderCatalog();
