# Booking System (NestJS + PostgreSQL + Redis + Kafka)

## Сервисы
- **api-service** — REST API шлюз
- **booking-service** — обработка логики бронирования

## Технологии
- NestJS 10
- PostgreSQL (Sequelize ORM) v17
- Redis для кеширования
- Kafka (kafkajs) для обмена событиями
- Umzug — миграции
- Jest + SQLite (in-memory) — тесты
- Node v22.20.0

## Запуск проекта

```bash
docker-compose up --build
```

## Тесты
```bash
npm run test
```
