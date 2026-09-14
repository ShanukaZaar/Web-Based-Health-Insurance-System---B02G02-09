# Database Management & Schema Strategy

This directory contains the database schema stubs and migration reference guide for the **Web-Based Health Insurance Management System**.

## Development Schema Strategy (Hibernate ORM)
During local development, Spring Data JPA & Hibernate ORM automatically handle table creation and schema updates via Spring Boot configuration (`application.yml`):

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

When JPA entities in the Spring Boot backend (`com.mlbb2g209.healthinsurance.*.entity`) are modified or added, Hibernate automatically updates table columns on application boot without requiring manual SQL DDL execution.

---

## Reference & Production Schema (`schema.sql`)
The `schema.sql` file contains commented-out `CREATE TABLE` stubs representing the target DDL structure for MySQL 8. Core entity tables outlined in the scaffolding include:
1. `users` & `roles` (User authentication & role management)
2. `policies` (Health insurance policies)
3. `claims` & `claim_documents` (Claim submissions and attached evidence)
4. `payments` (Premium & claim payout transactions)
5. `hospitals` (Empanelled hospital network)
6. `support_tickets` (Customer support inquiries)
7. `reports` (Admin system activity & financial reports)

For production deployments or database migrations (e.g. using Flyway or Liquibase), uncomment and execute `schema.sql` against your target MySQL server.
