# SaaS Project Portal

Многопользовательский SaaS портал для управления проектами компаний с документооборотом, расписанием, задачами, финансами, согласованиями, чатом в реальном времени и генерацией документов.

## Архитектура

- **Backend**: NestJS + Drizzle ORM + PostgreSQL + Redis + Socket.IO
- **Frontend**: Next.js 14 + Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL с RLS для мультитенантности
- **Storage**: S3-совместимое хранилище
- **Real-time**: Socket.IO для чата и уведомлений

## Структура монорепозитория

```
apps/
├── api/          # NestJS API
├── web/          # Next.js фронтенд
└── mobile/       # React Native (в будущем)

packages/
├── shared/       # Общие типы и DTOs (Zod)
├── sdk/          # OpenAPI клиент
├── ui/           # UI компоненты (shadcn/ui)
└── config/       # Конфигурация (ESLint, TS)
```

## Основные функции

### ✅ Phase 0 - Настройка репозитория (ВЫПОЛНЕНО)
- [x] Turborepo + PNPM workspaces
- [x] Общие пакеты (shared, ui, sdk, config)
- [x] Базовая структура API и Web приложений
- [x] ESLint, Prettier, TypeScript конфигурация

### 🔄 Phase 1 - Аутентификация и мультитенантность
- [ ] NestJS auth (JWT, cookies)
- [ ] Создание компании при первом входе
- [ ] RLS политики PostgreSQL
- [ ] Tenant guard и middleware

### 📋 Остальные фазы
- Phase 2: Объекты/проекты и участники
- Phase 3: Документы и загрузки (S3)
- Phase 4: Задачи и расписание (Kanban, Gantt)
- Phase 5: Финансы (расходы/доходы, маржа)
- Phase 6: Согласования (обязательная причина отклонения)
- Phase 7: Чат в реальном времени
- Phase 8: Шаблоны и генерация документов
- Phase 9: Предложения, договоры, закрывающие документы
- Phase 10: Система нумерации документов
- Phase 11: QA и тестирование

## Быстрый старт

### Установка зависимостей
```bash
pnpm install
```

### Настройка среды
```bash
cp .env.example .env.local
# Отредактируйте .env.local с вашими настройками
```

### База данных
```bash
# Создайте PostgreSQL базу данных
# Обновите DATABASE_URL в .env.local

# Генерация и выполнение миграций
pnpm db:generate
pnpm db:migrate
```

### Запуск разработки
```bash
# Запуск всех приложений
pnpm dev

# Или запуск отдельно
pnpm dev --filter=@saas/api      # API сервер
pnpm dev --filter=@saas/web      # Web приложение
```

## Скрипты

- `pnpm dev` - Запуск всех приложений в режиме разработки
- `pnpm build` - Сборка всех приложений
- `pnpm lint` - Линтинг всего кода
- `pnpm test` - Запуск тестов
- `pnpm db:generate` - Генерация миграций базы данных
- `pnpm db:migrate` - Выполнение миграций
- `pnpm generate:sdk` - Генерация OpenAPI клиента

## Документация

- API документация: http://localhost:3001/api/docs
- Веб приложение: http://localhost:3000

## Технологии

**Backend:**
- NestJS, Drizzle ORM, PostgreSQL
- Socket.IO, BullMQ + Redis
- JWT, Passport, Zod валидация
- Swagger/OpenAPI, Sentry

**Frontend:**
- Next.js 14 (App Router)
- TailwindCSS, shadcn/ui
- TanStack Query, React Hook Form + Zod
- Zustand, Socket.IO client

**Инструменты:**
- Turborepo, PNPM, TypeScript
- ESLint, Prettier, Vitest/Jest
- Playwright, Husky, Sentry