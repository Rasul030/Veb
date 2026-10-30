# Дерево компонентов MangaNest

```text
StrictMode
└── App
    └── BrowserRouter
        └── Routes
            └── AppLayout
                ├── SiteHeader — навигация, тема и демо-вход
                ├── BooksPage
                │   ├── FiltersPanel — управляет параметрами поиска
                │   ├── Spinner | EmptyState | ErrorBox
                │   ├── BookList
                │   │   └── BookCard
                │   │       ├── Badge
                │   │       └── Button
                │   └── Pagination
                ├── BookDetailsPage — сведения по id
                ├── BookFormPage — создание и изменение записи
                ├── WishlistPage — список за авторизацией
                ├── LoginPage | NotFoundPage
                └── SiteFooter
```

## Владельцы состояния

- URL хранит запрос, жанр, сортировку, наличие полного текста и страницу каталога.
- `useBooks` и `useBookDetails` управляют сетевым состоянием и отменой запроса.
- `useWishlist` загружает и сохраняет список в `localStorage`.
- `AuthContext` содержит демонстрационного пользователя; `ThemeContext` управляет темой.
- `BookFormPage` использует React Hook Form и Zod для валидации.

Статус сборки приложения нужно подтвердить командой `npm run build` в среде с Node.js.
