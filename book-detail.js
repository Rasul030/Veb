import { ApiError } from "./api/client.js";
import { getBookDetails } from "./api/books.js";
import { renderBookPage } from "./ui/render.js";

const workId = new URLSearchParams(window.location.search).get("id");
const main = document.querySelector("main");
const state = {
  status: "loading",
  message: "Загружаем сведения о манге…",
  book: null,
};
let controller = null;
let requestVersion = 0;

function describeDetailError(error) {
  if (error instanceof ApiError && error.status === 404) {
    return "Манга не найдена в Open Library (ошибка 404).";
  }
  if (error instanceof ApiError && error.status >= 500) {
    return `Open Library временно недоступна (ошибка ${error.status}).`;
  }
  if (error instanceof ApiError && error.status >= 400) {
    return `Open Library отклонила запрос (ошибка ${error.status}).`;
  }
  if (!navigator.onLine || error instanceof TypeError) {
    return "Нет соединения с Open Library. Проверьте сеть.";
  }
  return "Не удалось загрузить сведения о манге.";
}

async function loadDetails() {
  if (!workId) {
    state.status = "empty";
    state.message = "В ссылке нет идентификатора манги.";
    renderBookPage(state);
    return;
  }

  controller?.abort();
  controller = new AbortController();
  const currentController = controller;
  const version = ++requestVersion;
  state.status = "loading";
  state.message = "Загружаем сведения о манге…";
  renderBookPage(state);

  try {
    state.book = await getBookDetails(workId, currentController.signal);
    if (version !== requestVersion) return;
    state.status = "success";
    state.message = "Карточка манги загружена.";
  } catch (error) {
    if (error?.name === "AbortError" || version !== requestVersion) return;
    state.status = "error";
    state.message = describeDetailError(error);
  } finally {
    if (version === requestVersion) {
      renderBookPage(state);
    }
    if (controller === currentController) {
      controller = null;
    }
  }
}

main.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const retry = event.target.closest('[data-action="retry-detail"]');
  if (retry && main.contains(retry)) loadDetails();
});

loadDetails();
