# DevInsight - Клиентская часть

Клиентское приложение для кейса #2 DevInsight на хакатоне. Приложение предоставляет инструменты для анализа и визуализации данных разработчиков из GitHub.

## 🚀 Технологический стек

- [Remix Run](https://remix.run/) - Фреймворк для разработки веб-приложений
- [Prisma](https://www.prisma.io/) - ORM для работы с базой данных
- [PostgreSQL](https://www.postgresql.org/) - База данных
- [Docker](https://www.docker.com/) - Контейнеризация
- [shadcn/ui](https://ui.shadcn.com/) - Библиотека UI компонентов
- [Tailwind CSS](https://tailwindcss.com/) - CSS фреймворк

## 📋 Требования

Для запуска проекта необходимо:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (версия 21 или выше)
- [Yarn](https://yarnpkg.com/)

## 🛠 Установка и настройка

1. Клонируйте репозиторий:
```bash
git clone <url-репозитория>
cd <название-репозитория>
```

2. Установите зависимости:
```bash
yarn install
```

3. Настройте переменные окружения:
```bash
cp .env.example .env
```

Отредактируйте файл `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
# Добавьте другие необходимые переменные окружения
```

## 🚀 Запуск приложения

### Использование Docker Compose (Рекомендуется)

1. Запустите приложение и базу данных:
```bash
docker-compose up --build
```

Приложение будет доступно по адресу `http://localhost:3000`

### Использование Docker

1. Соберите Docker образ:
```bash
docker build -t devinsight-client .
```

2. Запустите контейнер:
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/dbname" \
  devinsight-client
```

### Режим разработки

1. Запустите PostgreSQL:
```bash
docker-compose up db
```

2. Запустите сервер разработки:
```bash
yarn dev
```

## 📦 Управление базой данных

### Применение миграций

Миграции применяются автоматически при запуске контейнера, но вы также можете применить их вручную:

```bash
# Через yarn
yarn prisma migrate deploy

# Внутри Docker контейнера
docker-compose exec app yarn prisma migrate deploy
```

### Создание новых миграций

```bash
# Создать новую миграцию
yarn prisma migrate dev --name название_миграции

# Сгенерировать Prisma Client
yarn prisma generate
```

## 📝 Доступные скрипты

- `yarn dev` - Запуск сервера разработки
- `yarn build` - Сборка приложения
- `yarn start` - Запуск production сервера
- `yarn typecheck` - Проверка типов TypeScript
- `yarn prisma:generate` - Генерация Prisma Client
- `yarn prisma:migrate` - Применение миграций
- `yarn docker:build` - Сборка Docker образа
- `yarn docker:run` - Запуск Docker контейнера

## 🔧 Команды Docker

### Основные команды

```bash
# Собрать и запустить все сервисы
docker-compose up --build

# Запустить сервисы в фоновом режиме
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Просмотр логов
docker-compose logs -f

# Выполнить команду в контейнере
docker-compose exec app sh
```

### Управление базой данных

```bash
# Доступ к CLI базы данных
docker-compose exec db psql -U user dbname

# Резервное копирование базы данных
docker-compose exec db pg_dump -U user dbname > backup.sql

# Восстановление базы данных
docker-compose exec -T db psql -U user dbname < backup.sql
```

### Управление контейнерами

```bash
# Удалить все контейнеры и тома
docker-compose down -v

# Пересобрать определенный сервис
docker-compose up --build app

# Просмотр статуса контейнеров
docker-compose ps
```

## 🌐 Переменные окружения

| Переменная | Описание | Значение по умолчанию |
|------------|----------|----------------------|
| `DATABASE_URL` | URL подключения к PostgreSQL | `postgresql://user:password@db:5432/dbname` |
| `GITHUB_TOKEN` | Ключ для доступа к GitHub API |  |
| `EXTERNAL_API_URL` | URL внешнего API для взаимодействия с llama |  |
| `PORT` | Порт приложения | `3000` |

## 📁 Структура проекта

```
├── app/
│   ├── routes/            # Маршруты приложения
│   ├── components/        # React компоненты
│   └── lib/            # Вспомогательные функции
├── prisma/
│   ├── schema.prisma     # Схема базы данных
│   └── migrations/       # Миграции базы данных
├── public/               # Статические файлы
├── Dockerfile           # Конфигурация Docker
├── docker-compose.yml   # Конфигурация Docker Compose
└── package.json         # Зависимости проекта
```
