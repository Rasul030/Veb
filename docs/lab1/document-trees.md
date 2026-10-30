# План семантических деревьев — ЛР 1

Краткий план структуры экранов. По требованию лабораторной Расулу также нужно перенести эти схемы на бумагу перед демонстрацией.

## Каталог `index.html`

```text
body
├── header
│   └── nav
├── main
│   ├── h1
│   ├── section: filters + form
│   ├── section: catalog
│   │   └── article × 6
│   │       ├── figure + figcaption
│   │       ├── h3 + author
│   │       └── summary + time + link
│   └── aside: recommendation
└── footer + nav
```

## Карточка `book.html`

```text
body
├── header + nav
├── main
│   ├── nav: breadcrumbs
│   └── article
│       ├── h1 + author
│       ├── figure: cover
│       ├── section: dl characteristics
│       ├── section: description
│       ├── section: reviews → article × 2
│       ├── section: review form
│       └── aside: related series
└── footer + nav
```

## Выдача `loan.html`

```text
body
├── header + nav
├── main
│   ├── h1 + introduction
│   ├── form
│   │   ├── fieldset: reader identity
│   │   ├── fieldset: loan settings
│   │   └── fieldset: confirmation
│   └── aside: loan rules
└── footer + nav
```
