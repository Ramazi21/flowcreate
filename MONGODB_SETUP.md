# Инструкция по подключению сайта к MongoDB

## Что я уже сделал:

1. **Изменил схему Prisma** (prisma/schema.prisma):
   - Заменил provider с `sqlite` на `mongodb`
   - Добавил поле `id` в модель `Account` для совместимости с MongoDB
   - Добавил поле `id` в модель `VerificationToken` для совместимости с MongoDB

2. **Обновил .env.example**:
   - Изменил DATABASE_URL на MongoDB connection string: `mongodb://localhost:27017/flowcreate`

## Что нужно сделать тебе:

### 1. Установить MongoDB

**Вариант A: Установить MongoDB локально (Windows)**

1. Скачай MongoDB Community Server с официального сайта: https://www.mongodb.com/try/download/community
2. Запусти установщик и следуй инструкциям
3. Убедись, что MongoDB запущен как сервис
4. По умолчанию MongoDB работает на порту 27017

**Вариант B: Использовать MongoDB Atlas (облачная база данных)**

1. Зарегистрируйся на https://www.mongodb.com/cloud/atlas
2. Создай бесплатный кластер (Free Tier)
3. Создай пользователя базы данных с правами读写
4. Получи connection string из MongoDB Atlas

### 2. Установить зависимости

Открой терминал в папке проекта и выполни:

```bash
npm install mongodb
```

Если возникнет ошибка с PowerShell, попробуй:
```bash
# Включить выполнение скриптов (только для текущей сессии)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install mongodb
```

### 3. Настроить .env файл

Скопируй .env.example в .env:
```bash
copy .env.example .env
```

Открой .env файл и измени DATABASE_URL:

**Для локальной MongoDB:**
```
DATABASE_URL="mongodb://localhost:27017/flowcreate"
```

**Для MongoDB Atlas:**
```
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/flowcreate?retryWrites=true&w=majority"
```

Замени `<username>`, `<password>` и `<cluster-url>` на свои данные из MongoDB Atlas.

### 4. Сгенерировать Prisma Client

Выполни в терминале:
```bash
npx prisma generate
```

### 5. Проверить подключение

Создай тестовый файл для проверки подключения (опционально):

```typescript
// test-mongodb.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Успешное подключение к MongoDB!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Ошибка подключения:', error);
    process.exit(1);
  }
}

testConnection();
```

Запусти:
```bash
npx tsx test-mongodb.ts
```

### 6. Удалить старые миграции SQLite (если они есть)

Удали папку prisma/migrations и файл prisma/dev.db, так как они для SQLite:
```bash
rmdir /s /q prisma\migrations
del prisma\dev.db
```

### 7. Запустить проект

```bash
npm run dev:no-turbo
```

## Возможные проблемы:

### Ошибка: "MongoServerError: Authentication failed"
- Проверь правильность username и password в connection string
- Убедись, что пользователь имеет необходимые права в MongoDB

### Ошибка: "MongoNetworkError"
- Проверь, что MongoDB запущен (для локальной)
- Проверь connection string (для MongoDB Atlas)
- Проверь firewall/сетевые настройки

### Ошибка: Prisma не может подключиться
- Убедись, что DATABASE_URL в .env правильный
- Попробуй сгенерировать Prisma Client снова: `npx prisma generate`

## Дополнительная информация:

- Prisma с MongoDB поддерживает большинство функций, но некоторые ограничения существуют
- Для продакшена используй MongoDB Atlas или настроенный MongoDB сервер
- Не забудь добавить .env в .gitignore (он уже должен быть там)
