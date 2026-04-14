# Atelier Local — маркетплейс декора

Full-stack учебный проект: витрина предметов интерьера ручной работы от локальных дизайнеров и мастерских. **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma + SQLite**, **NextAuth.js (Credentials + JWT)**.

## Требования

- Node.js 20+
- npm

## Установка и запуск

```bash
cd "C:\Users\pavel\OneDrive\Рабочий стол\CursorTests\SiteGovna"
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Переменные окружения: скопируйте `.env.example` в `.env` (в репозитории уже есть `.env` для локальной разработки). Для продакшена сгенерируйте новый `AUTH_SECRET`, например:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Демо-аккаунты (пароль у всех одинаковый)

| Роль    | Email               | Пароль    |
|---------|---------------------|-----------|
| Покупатель | `buyer@atelier.local`   | `Demo123!` |
| Продавец   | `maria@atelier.local`   | `Demo123!` |
| Продавец 2 | `ogon@atelier.local`    | `Demo123!` |
| Админ      | `admin@atelier.local`   | `Demo123!` |

## Возможности

- **Витрина**: главная, каталог с фильтром по категориям, быстрый просмотр товара (модалка), корзина, оформление заказа (сохранение в БД).
- **Гости**: корзина в cookie-сессии; после входа корзина переносится на аккаунт.
- **Дизайнеры**: список и страница профиля `/designers/[slug]`.
- **Продавец** (`/seller/dashboard`, `/seller/products/new`): добавление товара (уходит на модерацию `PENDING`).
- **Админ** (`/admin/dashboard`): метрики, модерация товаров и заявок дизайнеров.

## Скрипты

- `npm run dev` — разработка (Turbopack)
- `npm run build` / `npm run start` — продакшен-сборка
- `npm run db:studio` — Prisma Studio для просмотра БД
- `npm run db:seed` — повторный сид данных

## Структура

- `src/app/(marketing)/` — публичные страницы
- `src/app/seller/` — кабинет продавца
- `src/app/admin/` — админ-панель
- `src/app/actions/` — server actions (корзина, модерация, товары)
- `prisma/schema.prisma` — схема БД
- `prisma/seed.ts` — демо-данные

## Примечание по безопасности

Используемая версия Next.js при первой установке может иметь известные уязвимости; для деплоя обновите `next` до актуального патча (`npm info next version`).
